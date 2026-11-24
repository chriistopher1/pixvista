import {
  INewPost,
  INewUser,
  IPost,
  IUpdatePost,
  IUpdateUser,
  IUserDocument,
} from "@/types";
import { apiRequest } from "./client";
import { clearToken, setToken } from "./config";

type ListResponse<T> = {
  total: number;
  documents: T[];
};

type AuthResponse = {
  user: IUserDocument;
  token: string;
};

export async function createUserAuth(user: INewUser) {
  try {
    const data = await apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      auth: false,
      body: user,
    });
    setToken(data.token);
    return data.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const data = await apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      auth: false,
      body: user,
    });
    setToken(data.token);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function signOutAccount() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error(error);
  } finally {
    clearToken();
  }
  return { status: "ok" };
}

export async function isEmailAvailable(email: string) {
  try {
    const data = await apiRequest<{ available: boolean }>(
      `/api/auth/check-email?email=${encodeURIComponent(email)}`,
      { auth: false }
    );
    return data.available;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  try {
    return await apiRequest<IUserDocument>("/api/users/me");
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserById(userId: string) {
  try {
    return await apiRequest<IUserDocument>(`/api/users/${userId}`);
  } catch (error) {
    console.error(error);
  }
}

export async function getUsers(limit?: number) {
  try {
    const query = limit ? `?limit=${limit}` : "";
    return await apiRequest<ListResponse<IUserDocument>>(`/api/users${query}`);
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  try {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("bio", user.bio || "");
    if (user.file?.[0]) {
      formData.append("file", user.file[0]);
    }

    return await apiRequest<IUserDocument>(`/api/users/${user.userId}`, {
      method: "PATCH",
      body: formData,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    const formData = new FormData();
    formData.append("caption", post.caption);
    formData.append("location", post.location || "");
    formData.append("tags", post.tags || "");
    if (post.file?.[0]) {
      formData.append("file", post.file[0]);
    }

    return await apiRequest<IPost>("/api/posts", {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  try {
    const formData = new FormData();
    formData.append("caption", post.caption);
    formData.append("location", post.location || "");
    formData.append("tags", post.tags || "");
    if (post.file?.[0]) {
      formData.append("file", post.file[0]);
    }

    return await apiRequest<IPost>(`/api/posts/${post.postId}`, {
      method: "PATCH",
      body: formData,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getRecentPosts() {
  try {
    return await apiRequest<ListResponse<IPost>>("/api/posts/recent");
  } catch (error) {
    console.error(error);
  }
}

export async function getNewPost() {
  try {
    return await apiRequest<ListResponse<IPost>>("/api/posts/new");
  } catch (error) {
    console.error(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    return await apiRequest<ListResponse<IPost>>(
      `/api/posts/search?q=${encodeURIComponent(searchTerm)}`
    );
  } catch (error) {
    console.error(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam?: string }) {
  try {
    const cursor = pageParam ? `&cursor=${pageParam}` : "";
    return await apiRequest<ListResponse<IPost>>(
      `/api/posts/infinite?limit=9${cursor}`
    );
  } catch (error) {
    console.error(error);
  }
}

export async function getPostById(postId?: string) {
  if (!postId) throw Error("postId is required");

  try {
    return await apiRequest<IPost>(`/api/posts/${postId}`);
  } catch (error) {
    console.error(error);
  }
}

export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    return await apiRequest<ListResponse<IPost>>(`/api/posts/user/${userId}`);
  } catch (error) {
    console.error(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    return await apiRequest<IPost>(`/api/posts/${postId}/likes`, {
      method: "PUT",
      body: { likes: likesArray },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function savePost(userId: string | undefined, postId: string) {
  try {
    return await apiRequest("/api/saves", {
      method: "POST",
      body: { userId, postId },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    return await apiRequest(`/api/saves/${savedRecordId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deletePost(postId?: string, _imageId?: string) {
  if (!postId) return;

  try {
    return await apiRequest(`/api/posts/${postId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
  }
}
