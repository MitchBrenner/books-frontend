import type { User } from "@/types/api";

const LOCAL_STORAGE_KEY = "books.currentUser";
let cachedRawUser: string | null = null;
let cachedUser: User | null = null;

export function subscribeToSession() {
  return () => {};
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (storedUser === cachedRawUser) {
    return cachedUser;
  }

  if (!storedUser) {
    cachedRawUser = null;
    cachedUser = null;
    return null;
  }

  try {
    cachedRawUser = storedUser;
    cachedUser = JSON.parse(storedUser) as User;
    return cachedUser;
  } catch {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    cachedRawUser = null;
    cachedUser = null;
    return null;
  }
}
