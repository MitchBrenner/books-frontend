"use client";

import { type SyntheticEvent, useEffect, useState } from "react";
import { Plus, Save, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { deleteMyBook, saveBookToMyShelf, updateMyBook } from "@/lib/api/user-books";
import type {
  Book,
  CreateUserBookInput,
  UpdateUserBookInput,
  UserBook,
  UserBookStatus,
} from "@/types/api";
import { Button } from "@/components/ui/button";

type BookShelfFormProps = {
  book: Book;
  userBook?: UserBook | null;
  onSaved?: (userBookId: string, payload: CreateUserBookInput) => void;
  onUpdated?: (userBookId: string, payload: UpdateUserBookInput) => void;
  onDeleted?: (userBookId: string) => void;
  onCancel?: () => void;
};

const STATUS_OPTIONS: Array<{ value: UserBookStatus; label: string }> = [
  { value: "want_to_read", label: "Want to read" },
  { value: "reading", label: "Reading" },
  { value: "read", label: "Read" },
  { value: "dnf", label: "Did not finish" },
];

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 10);
}

export function BookShelfForm({
  book,
  userBook,
  onSaved,
  onUpdated,
  onDeleted,
  onCancel,
}: BookShelfFormProps) {
  const [status, setStatus] = useState<UserBookStatus>(userBook?.status ?? "want_to_read");
  const [rating, setRating] = useState<number | null>(userBook?.rating ?? null);
  const [review, setReview] = useState(userBook?.review ?? "");
  const [currPage, setCurrPage] = useState<number | null>(userBook?.currPage ?? null);
  const [startedAt, setStartedAt] = useState(toDateInputValue(userBook?.startedAt));
  const [finishedAt, setFinishedAt] = useState(toDateInputValue(userBook?.finishedAt));
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus(userBook?.status ?? "want_to_read");
    setRating(userBook?.rating ?? null);
    setReview(userBook?.review ?? "");
    setCurrPage(userBook?.currPage ?? null);
    setStartedAt(toDateInputValue(userBook?.startedAt));
    setFinishedAt(toDateInputValue(userBook?.finishedAt));
    setError(null);
  }, [userBook?.id]);

  const showCurrPage = status === "reading";
  const showStartedAt = status === "reading" || status === "read";
  const showFinishedAt = status === "read";
  const showRating = status === "read";
  const showReview = status === "read";

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (userBook) {
        const payload: UpdateUserBookInput = {
          status,
          rating: showRating ? rating : null,
          review: review.trim() || null,
          currPage: showCurrPage ? currPage : null,
          startedAt: showStartedAt ? startedAt || null : null,
          finishedAt: showFinishedAt ? finishedAt || null : null,
        };
        await updateMyBook(userBook.id, payload);
        toast.success(`"${book.title}" updated`);
        onUpdated?.(userBook.id, payload);
      } else {
        const payload: CreateUserBookInput = {
          bookId: book.id,
          status,
          rating: showRating ? rating : null,
          review: review.trim() || null,
          currPage: showCurrPage ? currPage : null,
          startedAt: showStartedAt ? startedAt || null : null,
          finishedAt: showFinishedAt ? finishedAt || null : null,
        };
        const { id: userBookId } = await saveBookToMyShelf(payload);
        toast.success(`"${book.title}" added to your shelf`);
        onSaved?.(userBookId, payload);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!userBook) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteMyBook(userBook.id);
      toast.success(`"${book.title}" removed from your shelf`);
      onDeleted?.(userBook.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-900">
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

      {showCurrPage ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="currPage" className="text-sm font-medium text-gray-900">
            Current page
          </label>
          <input
            type="number"
            id="currPage"
            min={0}
            max={10000}
            value={currPage ?? ""}
            onChange={(e) =>
              setCurrPage(e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="What page are you on?"
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-black"
          />
        </div>
      ) : null}

      {showStartedAt ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="startedAt" className="text-sm font-medium text-gray-900">
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
          <label htmlFor="finishedAt" className="text-sm font-medium text-gray-900">
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
            <label className="text-sm font-medium text-gray-900">Rating</label>
            {rating ? (
              <button
                type="button"
                className="cursor-pointer text-xs text-gray-400 hover:text-black"
                onClick={() => setRating(null)}
              >
                Clear
              </button>
            ) : null}
          </div>
          <div className="flex gap-1" onMouseLeave={() => setHoverRating(null)}>
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
          <label htmlFor="review" className="text-sm font-medium text-gray-900">
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

      <div className="flex-1" />

      {error ? (
        <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-500">
          {error}
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
            {isDeleting ? "Removing..." : "Remove"}
          </Button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-800"
            disabled={isSaving || isDeleting}
          >
            {userBook ? <Save /> : <Plus />}
            {isSaving ? "Saving..." : userBook ? "Save changes" : "Add to shelf"}
          </Button>
        </div>
      </div>
    </form>
  );
}
