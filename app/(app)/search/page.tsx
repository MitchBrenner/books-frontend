"use client";

import { BookCard } from "@/components/books/book-card";
import { Input } from "@/components/ui/input";
import { getBooksByQuery } from "@/lib/api/books";
import type { Book } from "@/types/api";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const data: Book[] = await getBooksByQuery(query);
      setBooks(data);
      setHasSearched(true);
    } catch {
      console.error("error");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#4a7c59]">Search</p>
        <h1 className="text-4xl font-semibold tracking-tight text-[#1a2e1f]">Find your next book</h1>
        <p className="mt-1 max-w-2xl text-base text-[#6b7f6e]">
          Search the catalog and start building your shelf.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-2xl gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author"
          className="h-11 rounded-md border-[#c8d9c4] bg-white px-4 focus-visible:ring-[#3d6449]"
        />
        <button
          type="submit"
          className="rounded-md bg-[#2d4a35] px-6 text-sm font-medium text-white transition-colors hover:bg-[#3d6449]"
        >
          Search
        </button>
      </form>

      {books.length > 0 && (
        <div className="grid gap-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {hasSearched && books.length === 0 && (
        <p className="text-sm text-[#6b7f6e]">No matches found for that search.</p>
      )}
    </main>
  );
}
