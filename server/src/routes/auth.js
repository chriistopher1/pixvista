import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { formatUser } from "../utils/formatters.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existing] = await pool.query(
      `SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1`,
      [email, username]
    );

    if (existing.length) {
      return res
        .status(409)
        .json({ message: "Email or username already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (name, username, email, password_hash)
       VALUES (?, ?, ?, ?)`,
      [name, username, email, passwordHash]
    );

    const [rows] = await pool.query(
      `SELECT id, name, username, email, bio, created_at, updated_at,
              (image IS NOT NULL) AS has_image
       FROM users WHERE id = ?`,
      [result.insertId]
    );

    const user = formatUser(rows[0]);
    const token = signToken(user.$id);

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const [rows] = await pool.query(
      `SELECT id, name, username, email, bio, password_hash, created_at, updated_at,
              (image IS NOT NULL) AS has_image
       FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    if (!rows[0]) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = formatUser(rows[0]);
    const token = signToken(user.$id);

    return res.json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login failed" });
  }
});

router.post("/logout", requireAuth, (_req, res) => {
  return res.json({ status: "ok" });
});

router.get("/check-email", async (req, res) => {
  try {
    const email = String(req.query.email || "");
    if (!email) return res.json({ available: false });

    const [rows] = await pool.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    return res.json({ available: rows.length === 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Check failed" });
  }
});

export default router;
