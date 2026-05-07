"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, ChevronLeft, Star } from "lucide-react";

import { getBookById } from "@/lib/api/books";
import { getMyBooks } from "@/lib/api/user-books";
import { BookShelfForm } from "@/components/books/book-shelf-form";
import { Skeleton } from "@/components/ui/skeleton";
import type { Book, UserBook } from "@/types/api";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [userBook, setUserBook] = useState<UserBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [bookData, myBooks] = await Promise.all([
          getBookById(id),
          getMyBooks(),
        ]);
        setBook(bookData);
        const existing = myBooks.find((b) => b.bookId === id);
        if (existing) setUserBook(existing);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load book");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [id]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Skeleton className="mb-8 h-5 w-16" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="flex gap-6">
            <Skeleton className="h-52 w-32 shrink-0" />
            <div className="flex flex-1 flex-col gap-3 py-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-8">
        <p className="text-sm text-red-500">{error ?? "Book not found"}</p>
      </main>
    );
  }

  const largeCoverUrl = book.coverUrl ?? null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex cursor-pointer items-center gap-1 text-sm text-gray-500 hover:text-black"
      >
        <ChevronLeft className="size-4" />
        Back
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
        <div>
          <div className="flex gap-6">
            {largeCoverUrl ? (
              <img
                src={largeCoverUrl}
                alt={`Cover for ${book.title}`}
                className="h-52 w-32 shrink-0 rounded-lg object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-52 w-32 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <BookOpen className="size-8 text-gray-300" />
              </div>
            )}

            <div className="flex min-w-0 flex-col gap-1 py-1">
              <h1 className="text-xl font-bold leading-tight text-black">
                {book.title}
              </h1>
              {book.subtitle ? (
                <p className="text-sm text-gray-500">{book.subtitle}</p>
              ) : null}
              <p className="mt-0.5 text-sm font-medium text-gray-900">
                {book.author}
              </p>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                {book.year ? <span>{book.year}</span> : null}
                {book.pages ? <span>{book.pages} pages</span> : null}
              </div>
              {book.googleRating ? (
                <div className="mt-2 flex items-center gap-1">
                  <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-500">
                    {book.googleRating} on Google
                  </span>
                </div>
              ) : null}
              {book.categories?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {book.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {book.description ? (
            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold text-gray-900">
                About this book
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {book.description}
              </p>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-gray-100 p-6 lg:sticky lg:top-8">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">
            {userBook ? "On your shelf" : "Add to shelf"}
          </h2>
          <BookShelfForm
            book={book}
            userBook={userBook}
            onSaved={(userBookId, payload) =>
              setUserBook({ id: userBookId, userId: "", ...payload, book })
            }
            onUpdated={(userBookId, payload) =>
              setUserBook((prev) => ({ ...prev!, ...payload }))
            }
            onDeleted={() => setUserBook(null)}
          />
        </div>
      </div>
    </main>
  );
}
