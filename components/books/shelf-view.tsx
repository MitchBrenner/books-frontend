"use client";

import { useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";
import CountUp from "react-countup";

import { Pencil, Star } from "lucide-react";

import { BookCard } from "@/components/books/book-card";
import { SaveBookDrawer } from "@/components/books/save-book-drawer";
import { Skeleton } from "@/components/ui/skeleton";
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
  const totalPagesRead = savedBooks.reduce((sum, b) => {
    if (b.status === "read") return sum + (b.book?.pages ?? 0);
    if (b.status === "reading") return sum + (b.currPage ?? 0);
    return sum;
  }, 0);
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
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex h-32 overflow-hidden rounded-xl border border-gray-100 bg-white">
              <Skeleton className="w-20 shrink-0 self-stretch rounded-none" />
              <div className="flex flex-1 flex-col gap-2 px-4 py-3.5">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
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
              <BookCard
                key={savedBook.id}
                book={savedBook.book}
                href={`/books/${savedBook.book.id}`}
                action={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingBook(savedBook);
                    }}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-black hover:text-black"
                    aria-label={`Edit ${savedBook.book.title}`}
                  >
                    <Pencil className="size-3.5" />
                  </button>
                }
                subtitle={
                  <div className="flex items-center gap-2">
                    <span className="text-xs capitalize text-gray-400">
                      {savedBook.status.replaceAll("_", " ")}
                    </span>
                    {savedBook.rating ? (
                      <div className="flex items-center gap-0.5 text-xs font-medium text-gray-500">
                        <span>{savedBook.rating}</span>
                        <Star className="size-3 fill-current text-gray-500" />
                      </div>
                    ) : null}
                  </div>
                }
              />
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
