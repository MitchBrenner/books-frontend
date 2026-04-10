import type { CreateUserInput, User } from "@/types/api";
import { apiFetch } from "./client";

export async function createUser(input: CreateUserInput) {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getUserByUsername(username: string) {
  const params = new URLSearchParams({ username });

  return apiFetch<User>(`/users/lookup?${params.toString()}`);
}
