"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { BookCard } from "@/components/books/book-card";
import { SaveBookDrawer } from "@/components/books/save-book-drawer";
import { Input } from "@/components/ui/input";
import { getBooksByQuery } from "@/lib/api/books";
import { getMyBooks } from "@/lib/api/user-books";
import type { Book, UserBook } from "@/types/api";

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
      <main className="mx-auto max-w-3xl px-8 py-12">
        <h1 className="mb-6 text-2xl font-bold text-black">Search</h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title or author..."
            className="h-10 flex-1 border-gray-200 bg-white text-sm focus-visible:border-black focus-visible:ring-0"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Search
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

        {books.length > 0 ? (
          <div className="mt-6 flex flex-col gap-2">
            {books.map((book) => {
              const isSaved = savedBookIds.has(book.id);

              return (
                <BookCard
                  key={book.id}
                  book={book}
                  action={
                    isSaved ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                        Saved
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedBook(book)}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-black transition-colors hover:border-black hover:bg-gray-50"
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
        ) : null}

        {hasSearched && books.length === 0 ? (
          <p className="mt-6 text-sm text-gray-500">No results found.</p>
        ) : null}
      </main>

      {selectedBook ? (
        <SaveBookDrawer
          mode="save"
          book={selectedBook}
          isOpen={true}
          onClose={() => setSelectedBook(null)}
          onSaved={(bookId) => {
            const savedBook = books.find((book) => book.id === bookId);
            if (savedBook) {
              handleBookSaved(savedBook);
            }
          }}
        />
      ) : null}
    </>
  );
}
