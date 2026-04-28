"use client";

import { useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";
import CountUp from "react-countup";

import { BookCard } from "@/components/books/book-card";
import { SaveBookDrawer } from "@/components/books/save-book-drawer";
import { getMyBooks } from "@/lib/api/user-books";
import type { UpdateUserBookInput, UserBook } from "@/types/api";

export function ShelfView() {
  const [savedBooks, setSavedBooks] = useState<UserBook[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<UserBook | null>(null);

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

  function handleUpdated(userBookId: string, data: UpdateUserBookInput) {
    setSavedBooks((prev) =>
      prev.map((b) => (b.id === userBookId ? { ...b, ...data } : b)),
    );
  }

  function handleDeleted(userBookId: string) {
    setSavedBooks((prev) => prev.filter((b) => b.id !== userBookId));
  }

  const booksRead = savedBooks.filter((b) => b.status === "read").length;
  const totalPagesRead = savedBooks
    .filter((b) => b.status === "read" && b.book?.pages)
    .reduce((sum, b) => sum + (b.book?.pages ?? 0), 0);
  const currentlyReading = savedBooks.filter((b) => b.status === "reading").length;

  const metrics = [
    { label: "Books read", value: booksRead, separator: "" },
    { label: "Pages read", value: totalPagesRead, separator: "," },
    { label: "Reading now", value: currentlyReading, separator: "" },
    { label: "Total saved", value: savedBooks.length, separator: "" },
  ];

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-black">Your shelf</h1>

        <div className="grid grid-cols-4 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-white px-4 py-4"
            >
              <CountUp
                end={metric.value}
                duration={1.2}
                separator={metric.separator}
                className="text-2xl font-bold text-black"
              />
              <span className="text-xs text-gray-400">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {isLoadingBooks ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : null}

      {!isLoadingBooks && savedBooks.length === 0 ? (
        <p className="text-sm text-gray-500">
          No books yet. Search for one and add it to your shelf.
        </p>
      ) : null}

      {savedBooks.length > 0 ? (
        <div className="flex flex-col gap-2">
          {savedBooks.map((savedBook) =>
            savedBook.book ? (
              <button
                key={savedBook.id}
                type="button"
                className="w-full cursor-pointer text-left"
                onClick={() => setEditingBook(savedBook)}
              >
                <BookCard
                  book={savedBook.book}
                  subtitle={
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
                      <span className="capitalize">
                        {savedBook.status.replaceAll("_", " ")}
                      </span>
                      {savedBook.rating ? (
                        <span>· {savedBook.rating} stars</span>
                      ) : null}
                    </div>
                  }
                />
              </button>
            ) : null,
          )}
        </div>
      ) : null}

      <AnimatePresence>
        {editingBook?.book ? (
          <SaveBookDrawer
            mode="edit"
            book={editingBook.book}
            userBook={editingBook}
            isOpen={true}
            onClose={() => setEditingBook(null)}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
