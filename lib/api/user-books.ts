import type { CreateUserBookInput, UserBook } from "@/types/api";
import { apiFetchWithAuth } from "./client";

export async function getMyBooks() {
  return apiFetchWithAuth<UserBook[]>("/me/books");
}

export async function saveBookToMyShelf(input: CreateUserBookInput) {
  return apiFetchWithAuth<{ message: string }>("/me/books", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
