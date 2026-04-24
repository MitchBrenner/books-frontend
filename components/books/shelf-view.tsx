"use client";

import { useEffect, useState } from "react";

import { BookCard } from "@/components/books/book-card";
import { getMyBooks } from "@/lib/api/user-books";
import type { UserBook } from "@/types/api";

export function ShelfView() {
  const [savedBooks, setSavedBooks] = useState<UserBook[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMyBooks() {
      try {
        const data = await getMyBooks();
        setSavedBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load your books");
      } finally {
        setIsLoadingBooks(false);
      }
    }

    void loadMyBooks();
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#4a7c59]">
            Your shelf
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1a2e1f]">
            Books you&apos;ve saved
          </h2>
        </div>
        <p className="text-sm text-[#6b7f6e]">{savedBooks.length} saved</p>
      </div>

      {error ? <p className="text-sm text-[#9b4b4b]">{error}</p> : null}

      {isLoadingBooks ? (
        <p className="text-sm text-[#6b7f6e]">Loading your shelf...</p>
      ) : null}

      {!isLoadingBooks && savedBooks.length === 0 ? (
        <p className="text-sm text-[#6b7f6e]">
          You haven&apos;t saved any books yet. Search for one and add it to your shelf.
        </p>
      ) : null}

      {savedBooks.length > 0 ? (
        <div className="grid gap-3">
          {savedBooks.map((savedBook) =>
            savedBook.book ? (
              <BookCard
                key={savedBook.id}
                book={savedBook.book}
                subtitle={
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#6b7f6e]">
                    <span>{savedBook.status.replaceAll("_", " ")}</span>
                    {savedBook.rating ? <span>{savedBook.rating} stars</span> : null}
                  </div>
                }
              />
            ) : null,
          )}
        </div>
      ) : null}
    </section>
  );
}
