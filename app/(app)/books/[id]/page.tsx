"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, ChevronLeft, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { getBookById } from "@/lib/api/books";
import {
  deleteMyBook,
  getMyBooks,
  saveBookToMyShelf,
  updateMyBook,
} from "@/lib/api/user-books";
import type {
  Book,
  CreateUserBookInput,
  UpdateUserBookInput,
  UserBook,
  UserBookStatus,
} from "@/types/api";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS: Array<{ value: UserBookStatus; label: string }> = [
  { value: "want_to_read", label: "Want to read" },
  { value: "reading", label: "Reading" },
  { value: "read", label: "Read" },
  { value: "dnf", label: "Did not finish" },
];

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [userBook, setUserBook] = useState<UserBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<UserBookStatus>("want_to_read");
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [finishedAt, setFinishedAt] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const showStartedAt = status === "reading" || status === "read";
  const showFinishedAt = status === "read";
  const showRating = status === "read";
  const showReview = status === "read";

  useEffect(() => {
    async function load() {
      try {
        const [bookData, myBooks] = await Promise.all([
          getBookById(id),
          getMyBooks(),
        ]);
        setBook(bookData);
        const existing = myBooks.find((b) => b.bookId === id);
        if (existing) {
          setUserBook(existing);
          setStatus(existing.status);
          setRating(existing.rating ?? null);
          setReview(existing.review ?? "");
          setStartedAt(existing.startedAt?.slice(0, 10) ?? "");
          setFinishedAt(existing.finishedAt?.slice(0, 10) ?? "");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load book");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [id]);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!book) return;
    setIsSaving(true);
    setFormError(null);

    try {
      if (userBook) {
        const payload: UpdateUserBookInput = {
          status,
          rating: showRating ? rating : null,
          review: review.trim() || null,
          startedAt: showStartedAt ? startedAt || null : null,
          finishedAt: showFinishedAt ? finishedAt || null : null,
        };
        await updateMyBook(userBook.id, payload);
        setUserBook({ ...userBook, ...payload });
        toast.success(`"${book.title}" updated`);
      } else {
        const payload: CreateUserBookInput = {
          bookId: id,
          status,
          rating: showRating ? rating : null,
          review: review.trim() || null,
          startedAt: showStartedAt ? startedAt || null : null,
          finishedAt: showFinishedAt ? finishedAt || null : null,
        };
        await saveBookToMyShelf(payload);
        setUserBook({ id: "", userId: "", ...payload });
        toast.success(`"${book.title}" added to your shelf`);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!userBook || !book) return;
    setIsDeleting(true);
    setFormError(null);
    try {
      await deleteMyBook(userBook.id);
      setUserBook(null);
      setStatus("want_to_read");
      setRating(null);
      setReview("");
      setStartedAt("");
      setFinishedAt("");
      toast.success(`"${book.title}" removed from your shelf`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to remove");
    } finally {
      setIsDeleting(false);
    }
  }

  const largeCoverUrl = book?.coverUrl?.replace("zoom=1", "zoom=3") ?? null;

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 h-5 w-16 animate-pulse rounded bg-gray-100" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="flex gap-6">
            <div className="h-52 w-32 animate-pulse rounded-lg bg-gray-100" />
            <div className="flex flex-1 flex-col gap-3 py-1">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-1/4 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
          <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
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
        {/* Left column — book info */}
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

        {/* Right column — shelf form */}
        <div className="rounded-xl border border-gray-100 p-6 lg:sticky lg:top-8">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">
            {userBook ? "On your shelf" : "Add to shelf"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-900"
            >
              Reading status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as UserBookStatus)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-black"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {showStartedAt ? (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="startedAt"
                className="text-sm font-medium text-gray-900"
              >
                Date started
              </label>
              <input
                type="date"
                id="startedAt"
                value={startedAt}
                onChange={(e) => setStartedAt(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-black"
              />
            </div>
          ) : null}

          {showFinishedAt ? (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="finishedAt"
                className="text-sm font-medium text-gray-900"
              >
                Date finished
              </label>
              <input
                type="date"
                id="finishedAt"
                value={finishedAt}
                onChange={(e) => setFinishedAt(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-black"
              />
            </div>
          ) : null}

          {showRating ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">
                  Rating
                </label>
                {rating ? (
                  <button
                    type="button"
                    className="text-xs text-gray-400 hover:text-black"
                    onClick={() => setRating(null)}
                  >
                    Clear
                  </button>
                ) : null}
              </div>
              <div
                className="flex gap-1"
                onMouseLeave={() => setHoverRating(null)}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const fullValue = i + 1;
                  const halfValue = i + 0.5;
                  const display = hoverRating ?? rating ?? 0;
                  const isFull = display >= fullValue;
                  const isHalf = !isFull && display >= halfValue;
                  return (
                    <div key={fullValue} className="relative size-8">
                      {isFull ? (
                        <Star className="size-8 fill-current text-black" />
                      ) : isHalf ? (
                        <span className="relative block size-8">
                          <Star className="absolute inset-0 size-8 text-gray-200" />
                          <span className="absolute inset-0 w-1/2 overflow-hidden">
                            <Star className="size-8 fill-current text-black" />
                          </span>
                        </span>
                      ) : (
                        <Star className="size-8 text-gray-200" />
                      )}
                      <button
                        type="button"
                        className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                        aria-label={`Set rating to ${halfValue} stars`}
                        onMouseEnter={() => setHoverRating(halfValue)}
                        onClick={() => setRating(halfValue)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
                        aria-label={`Set rating to ${fullValue} stars`}
                        onMouseEnter={() => setHoverRating(fullValue)}
                        onClick={() => setRating(fullValue)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {showReview ? (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="review"
                className="text-sm font-medium text-gray-900"
              >
                Review
              </label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you think?"
                className="min-h-28 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
              />
            </div>
          ) : null}

          {formError ? (
            <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-500">
              {formError}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            {userBook ? (
              <Button
                type="button"
                variant="ghost"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                disabled={isDeleting || isSaving}
                onClick={handleDelete}
              >
                <Trash2 />
                {isDeleting ? "Removing..." : "Remove from shelf"}
              </Button>
            ) : (
              <div />
            )}
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
              disabled={isSaving || isDeleting}
            >
              {isSaving
                ? "Saving..."
                : userBook
                  ? "Save changes"
                  : "Add to shelf"}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </main>
  );
}
