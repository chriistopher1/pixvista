export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const TOKEN_KEY = "pixvista_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
