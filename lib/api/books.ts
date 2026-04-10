import type { Book } from "@/types/api";
import { apiFetch } from "./client";

export async function getBooksByQuery(query: string) {
  const params = new URLSearchParams({ q: query });
  return apiFetch<Book[]>(`/books/search?${params.toString()}`);
}
