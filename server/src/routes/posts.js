import { Router } from "express";
import pool from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import { listResponse, parseTags } from "../utils/formatters.js";
import { fetchPostById, fetchPosts } from "../utils/postQueries.js";

const router = Router();

router.get("/recent", requireAuth, async (_req, res) => {
  try {
    const documents = await fetchPosts({ limit: 20 });
    return res.json(listResponse(documents));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load posts" });
  }
});

router.get("/new", requireAuth, async (_req, res) => {
  try {
    const documents = await fetchPosts({
      whereSql: "WHERE DATE(p.created_at) = CURDATE()",
      limit: 20,
    });
    return res.json(listResponse(documents));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load new posts" });
  }
});

router.get("/search", requireAuth, async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.json(listResponse([]));

    const documents = await fetchPosts({
      whereSql: "WHERE p.caption LIKE ?",
      params: [`%${q}%`],
      limit: 50,
    });
    return res.json(listResponse(documents));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Search failed" });
  }
});

router.get("/infinite", requireAuth, async (req, res) => {
  try {
    const limit = Number(req.query.limit || 9);
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;

    const documents = await fetchPosts({
      whereSql: cursor ? "WHERE p.id < ?" : "",
      params: cursor ? [cursor] : [],
      orderBy: "p.id DESC",
      limit,
    });

    return res.json(listResponse(documents));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load posts" });
  }
});

router.get("/user/:userId", requireAuth, async (req, res) => {
  try {
    const documents = await fetchPosts({
      whereSql: "WHERE p.creator_id = ?",
      params: [Number(req.params.userId)],
    });
    return res.json(listResponse(documents));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load user posts" });
  }
});

router.get("/:id/image", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT image, image_mime FROM posts WHERE id = ? LIMIT 1`,
      [Number(req.params.id)]
    );

    if (!rows[0]?.image) {
      return res.status(404).end();
    }

    res.setHeader("Content-Type", rows[0].image_mime || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(rows[0].image);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load image" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const post = await fetchPostById(Number(req.params.id));
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load post" });
  }
});

router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const caption = req.body.caption || "";
    const location = req.body.location || "";
    const tags = parseTags(
      typeof req.body.tags === "string"
        ? req.body.tags.replace(/ /g, "").split(",")
        : req.body.tags
    );

    const [result] = await pool.query(
      `INSERT INTO posts (creator_id, caption, image, image_mime, location, tags)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        caption,
        req.file.buffer,
        req.file.mimetype,
        location,
        JSON.stringify(tags),
      ]
    );

    const post = await fetchPostById(result.insertId);
    return res.status(201).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create post" });
  }
});

router.patch("/:id", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const [existing] = await pool.query(
      `SELECT id, creator_id FROM posts WHERE id = ? LIMIT 1`,
      [postId]
    );

    if (!existing[0]) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (existing[0].creator_id !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const caption = req.body.caption || "";
    const location = req.body.location || "";
    const tags = parseTags(
      typeof req.body.tags === "string"
        ? req.body.tags.replace(/ /g, "").split(",")
        : req.body.tags
    );

    if (req.file) {
      await pool.query(
        `UPDATE posts
         SET caption = ?, location = ?, tags = ?, image = ?, image_mime = ?
         WHERE id = ?`,
        [
          caption,
          location,
          JSON.stringify(tags),
          req.file.buffer,
          req.file.mimetype,
          postId,
        ]
      );
    } else {
      await pool.query(
        `UPDATE posts SET caption = ?, location = ?, tags = ? WHERE id = ?`,
        [caption, location, JSON.stringify(tags), postId]
      );
    }

    const post = await fetchPostById(postId);
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update post" });
  }
});

router.put("/:id/likes", requireAuth, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const likesArray = Array.isArray(req.body.likes)
      ? req.body.likes.map(String)
      : [];

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(`DELETE FROM likes WHERE post_id = ?`, [postId]);

      for (const userId of likesArray) {
        await connection.query(
          `INSERT INTO likes (user_id, post_id) VALUES (?, ?)`,
          [Number(userId), postId]
        );
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    const post = await fetchPostById(postId);
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update likes" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const [existing] = await pool.query(
      `SELECT creator_id FROM posts WHERE id = ? LIMIT 1`,
      [postId]
    );

    if (!existing[0]) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (existing[0].creator_id !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await pool.query(`DELETE FROM posts WHERE id = ?`, [postId]);
    return res.json({ status: "Ok" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete post" });
  }
});

export default router;
