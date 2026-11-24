import pool from "../config/db.js";
import { formatPost, formatUser } from "./formatters.js";

const POST_SELECT = `
  SELECT
    p.id,
    p.creator_id,
    p.caption,
    p.location,
    p.tags,
    p.created_at,
    p.updated_at,
    u.name AS creator_name,
    u.username AS creator_username,
    (u.image IS NOT NULL) AS creator_has_image
  FROM posts p
  INNER JOIN users u ON u.id = p.creator_id
`;

export async function getLikesForPosts(postIds) {
  if (!postIds.length) return new Map();

  const [rows] = await pool.query(
    `SELECT l.post_id, u.id, u.name, u.username, (u.image IS NOT NULL) AS has_image
     FROM likes l
     INNER JOIN users u ON u.id = l.user_id
     WHERE l.post_id IN (?)`,
    [postIds]
  );

  const map = new Map();
  for (const row of rows) {
    const key = row.post_id;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(formatUser(row));
  }
  return map;
}

export async function hydratePosts(rows) {
  const likesMap = await getLikesForPosts(rows.map((r) => r.id));
  return rows.map((row) =>
    formatPost(row, { likes: likesMap.get(row.id) || [] })
  );
}

export async function fetchPostById(postId) {
  const [rows] = await pool.query(`${POST_SELECT} WHERE p.id = ? LIMIT 1`, [
    postId,
  ]);
  if (!rows[0]) return null;
  const [hydrated] = await hydratePosts(rows);
  return hydrated;
}

export async function fetchPosts({
  whereSql = "",
  params = [],
  orderBy = "p.created_at DESC",
  limit,
  offset,
} = {}) {
  let sql = `${POST_SELECT} ${whereSql} ORDER BY ${orderBy}`;
  const queryParams = [...params];

  if (limit != null) {
    sql += " LIMIT ?";
    queryParams.push(Number(limit));
  }
  if (offset != null) {
    sql += " OFFSET ?";
    queryParams.push(Number(offset));
  }

  const [rows] = await pool.query(sql, queryParams);
  return hydratePosts(rows);
}

export { POST_SELECT };
