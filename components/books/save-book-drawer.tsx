"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Star, X } from "lucide-react";

import { saveBookToMyShelf } from "@/lib/api/user-books";
import type { Book, CreateUserBookInput, UserBookStatus } from "@/types/api";
import { Button } from "@/components/ui/button";

type SaveBookDrawerProps = {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (bookId: string) => void;
};

const STATUS_OPTIONS: Array<{ value: UserBookStatus; label: string }> = [
  { value: "want_to_read", label: "Want to read" },
  { value: "reading", label: "Reading" },
  { value: "read", label: "Read" },
  { value: "dnf", label: "Did not finish" },
];

export function SaveBookDrawer({
  book,
  isOpen,
  onClose,
  onSaved,
}: SaveBookDrawerProps) {
  const [status, setStatus] = useState<UserBookStatus>("want_to_read");
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setStatus("want_to_read");
    setRating(null);
    setReview("");
    setError(null);
  }, [isOpen, book?.id]);

  const title = useMemo(() => book?.title ?? "Book", [book?.title]);

  if (!book || !isOpen) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload: CreateUserBookInput = {
      bookId: book.id,
      status,
      rating,
      review: review.trim() || null,
    };

    try {
      await saveBookToMyShelf(payload);
      onSaved(book.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/25">
      <button
        type="button"
        aria-label="Close save drawer"
        className="flex-1 cursor-default"
        onClick={onClose}
      />

      <aside className="flex h-full w-full max-w-md flex-col border-l border-[#c8d9c4] bg-[#faf8f4] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#d7e3d4] px-6 py-5">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#4a7c59]">
              Save to shelf
            </p>
            <h2 className="truncate text-xl font-semibold text-[#1a2e1f]">
              {title}
            </h2>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
          >
            <X />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-6 px-6 py-6"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="status"
              className="text-sm font-medium text-[#1a2e1f]"
            >
              Reading status
            </label>
            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as UserBookStatus)
              }
              className="h-11 rounded-md border border-[#c8d9c4] bg-white px-3 text-sm text-[#1a2e1f] outline-none transition focus:border-[#3d6449]"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#1a2e1f]">
                Rating
              </label>
              {rating ? (
                <button
                  type="button"
                  className="text-xs font-medium text-[#6b7f6e] hover:text-[#1a2e1f]"
                  onClick={() => setRating(null)}
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                const isActive = value <= (rating ?? 0);

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`flex size-10 items-center justify-center rounded-md border transition ${
                      isActive
                        ? "border-[#3d6449] bg-[#e8f0e8] text-[#2d4a35]"
                        : "border-[#c8d9c4] bg-white text-[#9eb59a] hover:border-[#aac2a7] hover:text-[#6b7f6e]"
                    }`}
                    aria-label={`Set rating to ${value} stars`}
                  >
                    <Star
                      className={`size-4 ${isActive ? "fill-current" : ""}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="review"
              className="text-sm font-medium text-[#1a2e1f]"
            >
              Quick note
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="Optional note about why you saved it"
              className="min-h-28 rounded-md border border-[#c8d9c4] bg-white px-3 py-3 text-sm text-[#1a2e1f] outline-none transition focus:border-[#3d6449]"
            />
          </div>

          {error ? (
            <p className="rounded-md border border-[#e0c2c2] bg-[#fff3f3] px-3 py-2 text-sm text-[#9b4b4b]">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-3 border-t border-[#d7e3d4] pt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#2d4a35] text-white hover:bg-[#3d6449]"
              disabled={isSaving}
            >
              <Plus />
              {isSaving ? "Saving..." : "Save book"}
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
}
