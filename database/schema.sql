-- =============================================================================
-- PixVista MySQL Schema (XAMPP / MariaDB / MySQL 8+)
-- =============================================================================
-- Import via phpMyAdmin (Import tab) or:
--   mysql -u root < database/schema.sql
--
-- Entity relationships (ER):
--
--   users 1 ─────< posts        (one user creates many posts)
--   users 1 ─────< likes        (one user likes many posts)
--   posts 1 ─────< likes        (one post receives many likes)
--   users 1 ─────< saves        (one user saves many posts)
--   posts 1 ─────< saves        (one post can be saved by many users)
--
--   likes and saves are junction (many-to-many) tables between users and posts.
--   Images are stored as LONGBLOB columns on users and posts (not filesystem).
-- =============================================================================

CREATE DATABASE IF NOT EXISTS pixvista
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pixvista;

-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT NULL,
  image LONGBLOB NULL COMMENT 'Profile picture binary data',
  image_mime VARCHAR(100) NULL COMMENT 'e.g. image/jpeg, image/png',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- posts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  creator_id INT UNSIGNED NOT NULL,
  caption TEXT NOT NULL,
  image LONGBLOB NOT NULL COMMENT 'Post image binary data',
  image_mime VARCHAR(100) NOT NULL,
  location VARCHAR(255) NULL,
  tags JSON NULL COMMENT 'JSON array of tag strings, e.g. ["art","travel"]',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_posts_creator (creator_id),
  KEY idx_posts_created_at (created_at),
  CONSTRAINT fk_posts_creator
    FOREIGN KEY (creator_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- likes  (users N:M posts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS likes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  post_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_likes_user_post (user_id, post_id),
  KEY idx_likes_post (post_id),
  CONSTRAINT fk_likes_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_likes_post
    FOREIGN KEY (post_id) REFERENCES posts (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- saves  (users N:M posts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saves (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  post_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_saves_user_post (user_id, post_id),
  KEY idx_saves_post (post_id),
  CONSTRAINT fk_saves_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_saves_post
    FOREIGN KEY (post_id) REFERENCES posts (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
