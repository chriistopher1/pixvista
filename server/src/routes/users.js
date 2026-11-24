import { Router } from "express";
import pool from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import { formatUser, listResponse } from "../utils/formatters.js";
import { fetchPosts, fetchPostById } from "../utils/postQueries.js";

const router = Router();

async function getUserRow(userId) {
  const [rows] = await pool.query(
    `SELECT id, name, username, email, bio, created_at, updated_at,
            (image IS NOT NULL) AS has_image
     FROM users WHERE id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function buildCurrentUserPayload(userId) {
  const row = await getUserRow(userId);
  if (!row) return null;

  const user = formatUser(row);

  const [saveRows] = await pool.query(
    `SELECT s.id AS save_id, s.post_id
     FROM saves s
     WHERE s.user_id = ?
     ORDER BY s.created_at DESC`,
    [userId]
  );

  const save = [];
  for (const saveRow of saveRows) {
    const post = await fetchPostById(saveRow.post_id);
    if (post) {
      save.push({
        $id: String(saveRow.save_id),
        post,
      });
    }
  }

  const [likedRows] = await pool.query(
    `SELECT post_id FROM likes WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );

  const liked = [];
  for (const likeRow of likedRows) {
    const post = await fetchPostById(likeRow.post_id);
    if (post) liked.push(post);
  }

  const posts = await fetchPosts({
    whereSql: "WHERE p.creator_id = ?",
    params: [userId],
  });

  return {
    ...user,
    save,
    liked,
    posts,
  };
}

router.get("/me", requireAuth, async (req, res) => {
  try {
    const payload = await buildCurrentUserPayload(req.userId);
    if (!payload) return res.status(404).json({ message: "User not found" });
    return res.json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load current user" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    let sql = `SELECT id, name, username, email, bio, created_at, updated_at,
                      (image IS NOT NULL) AS has_image
               FROM users
               ORDER BY created_at DESC`;
    const params = [];

    if (limit) {
      sql += " LIMIT ?";
      params.push(limit);
    }

    const [rows] = await pool.query(sql, params);
    return res.json(listResponse(rows.map((row) => formatUser(row))));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load users" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const row = await getUserRow(userId);
    if (!row) return res.status(404).json({ message: "User not found" });

    const posts = await fetchPosts({
      whereSql: "WHERE p.creator_id = ?",
      params: [userId],
    });

    return res.json({
      ...formatUser(row),
      posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load user" });
  }
});

router.get("/:id/image", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT image, image_mime FROM users WHERE id = ? LIMIT 1`,
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

router.patch("/:id", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (req.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, bio } = req.body;

    if (req.file) {
      await pool.query(
        `UPDATE users SET name = ?, bio = ?, image = ?, image_mime = ? WHERE id = ?`,
        [name, bio || "", req.file.buffer, req.file.mimetype, userId]
      );
    } else {
      await pool.query(`UPDATE users SET name = ?, bio = ? WHERE id = ?`, [
        name,
        bio || "",
        userId,
      ]);
    }

    const row = await getUserRow(userId);
    return res.json(formatUser(row));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update user" });
  }
});

export default router;
