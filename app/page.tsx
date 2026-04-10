"use client";

import type { User } from "@/types/api";
import { useState } from "react";
import Login from "./login/page";

const LOCAL_STORAGE_KEY = "books.currentUser";

function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null;
  }
}

export default function Home() {
  const [currentUser] = useState<User | null>(getStoredUser);

  if (!currentUser) {
    return <Login />;
  }

  return <div>Logged in as {currentUser.username}</div>;
}
