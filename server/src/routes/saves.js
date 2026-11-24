import { Router } from "express";
import pool from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = Number(req.body.userId || req.userId);
    const postId = Number(req.body.postId);

    if (userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }

    const [result] = await pool.query(
      `INSERT INTO saves (user_id, post_id) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [userId, postId]
    );

    return res.status(201).json({
      $id: String(result.insertId),
      user: String(userId),
      post: String(postId),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to save post" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const saveId = Number(req.params.id);
    const [rows] = await pool.query(
      `SELECT user_id FROM saves WHERE id = ? LIMIT 1`,
      [saveId]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Save not found" });
    }
    if (rows[0].user_id !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await pool.query(`DELETE FROM saves WHERE id = ?`, [saveId]);
    return res.json({ status: "Ok" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete save" });
  }
});

export default router;
