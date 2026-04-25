import type { CreateUserBookInput, UpdateUserBookInput, UserBook } from "@/types/api";
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

export async function updateMyBook(userBookId: string, input: UpdateUserBookInput) {
  return apiFetchWithAuth<{ message: string }>(`/me/books/${userBookId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteMyBook(userBookId: string) {
  return apiFetchWithAuth<{ message: string }>(`/me/books/${userBookId}`, {
    method: "DELETE",
  });
}
