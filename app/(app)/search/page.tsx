"use client";

import { BookCard } from "@/components/books/book-card";
import { SaveBookDrawer } from "@/components/books/save-book-drawer";
import { Input } from "@/components/ui/input";
import { getBooksByQuery } from "@/lib/api/books";
import { getMyBooks } from "@/lib/api/user-books";
import type { Book, UserBook } from "@/types/api";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [savedBooks, setSavedBooks] = useState<UserBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMyBooks() {
      try {
        const data = await getMyBooks();
        setSavedBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load your books");
      }
    }

    void loadMyBooks();
  }, []);

  const savedBookIds = useMemo(
    () => new Set(savedBooks.map((savedBook) => savedBook.bookId)),
    [savedBooks],
  );

  async function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      const data: Book[] = await getBooksByQuery(query);
      setBooks(data);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search books");
    }
  }

  function handleBookSaved(book: Book) {
    setSavedBooks((current) => [
      ...current,
      {
        id: `local-${book.id}`,
        userId: "",
        bookId: book.id,
        status: "want_to_read",
        rating: null,
        review: null,
        book,
      },
    ]);
  }

  return (
    <>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#4a7c59]">
            Search
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1a2e1f]">
            Find your next book
          </h1>
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

        {error ? (
          <p className="text-sm text-[#9b4b4b]">{error}</p>
        ) : null}

        {books.length > 0 && (
          <div className="grid gap-3">
            {books.map((book) => {
              const isSaved = savedBookIds.has(book.id);

              return (
                <BookCard
                  key={book.id}
                  book={book}
                  action={
                    isSaved ? (
                      <span className="rounded-full bg-[#e8f0e8] px-3 py-1 text-xs font-medium text-[#2d4a35]">
                        Saved
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedBook(book)}
                        className="flex size-8 items-center justify-center rounded-full border border-[#c8d9c4] text-[#2d4a35] transition-colors hover:border-[#2d4a35] hover:bg-[#f3f7f2]"
                        aria-label={`Save ${book.title}`}
                      >
                        <Plus className="size-4" />
                      </button>
                    )
                  }
                />
              );
            })}
          </div>
        )}

        {hasSearched && books.length === 0 && (
          <p className="text-sm text-[#6b7f6e]">No matches found for that search.</p>
        )}
      </main>

      <SaveBookDrawer
        book={selectedBook}
        isOpen={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
        onSaved={(bookId) => {
          const savedBook = books.find((book) => book.id === bookId);

          if (savedBook) {
            handleBookSaved(savedBook);
          }
        }}
      />
    </>
  );
}
