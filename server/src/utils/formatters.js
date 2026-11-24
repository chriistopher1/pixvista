const API_BASE = () =>
  process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;

export function parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) {
        return parsed.map((t) => String(t).trim()).filter(Boolean);
      }
    } catch {
      // fall through to comma split
    }
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

export function userImageUrl(userId) {
  return `${API_BASE()}/api/users/${userId}/image`;
}

export function postImageUrl(postId) {
  return `${API_BASE()}/api/posts/${postId}/image`;
}

/** Shape a user row into the document format the React app expects */
export function formatUser(row, { includeImageFlag = true } = {}) {
  if (!row) return null;

  const id = String(row.id);
  const hasImage = includeImageFlag
    ? Boolean(row.has_image ?? row.image)
    : true;

  return {
    $id: id,
    accountId: id,
    name: row.name,
    username: row.username,
    email: row.email,
    bio: row.bio || "",
    imageUrl: hasImage ? userImageUrl(row.id) : "",
    imageId: hasImage ? id : "",
    $createdAt: row.created_at,
    $updatedAt: row.updated_at,
  };
}

export function formatCreator(row) {
  if (!row) return null;
  const id = String(row.id);
  return {
    $id: id,
    accountId: id,
    name: row.name,
    username: row.username,
    imageUrl: row.has_image ? userImageUrl(row.id) : "",
  };
}

export function formatPost(row, { likes = [], creator } = {}) {
  if (!row) return null;

  const id = String(row.id);
  return {
    $id: id,
    caption: row.caption,
    location: row.location || "",
    tags: parseTags(row.tags),
    imageUrl: postImageUrl(row.id),
    imageId: id,
    likes,
    creator: creator || formatCreator({
      id: row.creator_id,
      name: row.creator_name,
      username: row.creator_username,
      has_image: row.creator_has_image,
    }),
    $createdAt: row.created_at,
    $updatedAt: row.updated_at,
  };
}

export function listResponse(documents) {
  return {
    total: documents.length,
    documents,
  };
}
