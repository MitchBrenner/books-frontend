"use client";

import { type SyntheticEvent, useEffect, useMemo, useState } from "react";
import { Plus, Save, Star, Trash2, X } from "lucide-react";

import { deleteMyBook, saveBookToMyShelf, updateMyBook } from "@/lib/api/user-books";
import type { Book, CreateUserBookInput, UpdateUserBookInput, UserBook, UserBookStatus } from "@/types/api";
import { Button } from "@/components/ui/button";

type SaveBookDrawerProps =
  | {
      mode: "save";
      book: Book;
      isOpen: boolean;
      onClose: () => void;
      onSaved: (bookId: string) => void;
    }
  | {
      mode: "edit";
      book: Book;
      userBook: UserBook;
      isOpen: boolean;
      onClose: () => void;
      onUpdated: (userBookId: string, data: UpdateUserBookInput) => void;
      onDeleted: (userBookId: string) => void;
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

export function SaveBookDrawer(props: SaveBookDrawerProps) {
  const { book, isOpen, onClose } = props;

  const initialStatus = props.mode === "edit" ? props.userBook.status : "want_to_read";
  const initialRating = props.mode === "edit" ? (props.userBook.rating ?? null) : null;
  const initialReview = props.mode === "edit" ? (props.userBook.review ?? "") : "";
  const initialStartedAt = props.mode === "edit" ? toDateInputValue(props.userBook.startedAt) : "";
  const initialFinishedAt = props.mode === "edit" ? toDateInputValue(props.userBook.finishedAt) : "";

  const [status, setStatus] = useState<UserBookStatus>(initialStatus);
  const [rating, setRating] = useState<number | null>(initialRating);
  const [review, setReview] = useState(initialReview);
  const [startedAt, setStartedAt] = useState(initialStartedAt);
  const [finishedAt, setFinishedAt] = useState(initialFinishedAt);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showStartedAt = status === "reading" || status === "read";
  const showFinishedAt = status === "read";
  const showRating = status === "read";
  const showReview = status === "read";

  useEffect(() => {
    if (!isOpen) return;

    if (props.mode === "edit") {
      setStatus(props.userBook.status);
      setRating(props.userBook.rating ?? null);
      setReview(props.userBook.review ?? "");
      setStartedAt(toDateInputValue(props.userBook.startedAt));
      setFinishedAt(toDateInputValue(props.userBook.finishedAt));
    } else {
      setStatus("want_to_read");
      setRating(null);
      setReview("");
      setStartedAt("");
      setFinishedAt("");
    }
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, book?.id]);

  function handleStatusChange(newStatus: UserBookStatus) {
    setStatus(newStatus);
    if (newStatus === "want_to_read" || newStatus === "dnf") {
      setStartedAt("");
      setFinishedAt("");
    } else if (newStatus === "reading") {
      setFinishedAt("");
    }
  }

  const title = useMemo(() => book?.title ?? "Book", [book?.title]);

  if (!book || !isOpen) return null;

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (props.mode === "edit") {
        const payload: UpdateUserBookInput = {
          status,
          rating: showRating ? rating : null,
          review: review.trim() || null,
          startedAt: showStartedAt ? (startedAt || null) : null,
          finishedAt: showFinishedAt ? (finishedAt || null) : null,
        };
        await updateMyBook(props.userBook.id, payload);
        props.onUpdated(props.userBook.id, payload);
      } else {
        const payload: CreateUserBookInput = {
          bookId: book.id,
          status,
          rating: showRating ? rating : null,
          review: review.trim() || null,
          startedAt: showStartedAt ? (startedAt || null) : null,
          finishedAt: showFinishedAt ? (finishedAt || null) : null,
        };
        await saveBookToMyShelf(payload);
        props.onSaved(book.id);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (props.mode !== "edit") return;
    setIsDeleting(true);
    setError(null);

    try {
      await deleteMyBook(props.userBook.id);
      props.onDeleted(props.userBook.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
    } finally {
      setIsDeleting(false);
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
              {props.mode === "edit" ? "Edit book" : "Save to shelf"}
            </p>
            <h2 className="truncate text-xl font-semibold text-[#1a2e1f]">
              {title}
            </h2>
          </div>

          <Button type="button" variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm font-medium text-[#1a2e1f]">
              Reading status
            </label>
            <select
              id="status"
              value={status}
              onChange={(event) => handleStatusChange(event.target.value as UserBookStatus)}
              className="h-11 rounded-md border border-[#c8d9c4] bg-white px-3 text-sm text-[#1a2e1f] outline-none transition focus:border-[#3d6449]"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {showStartedAt ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="startedAt" className="text-sm font-medium text-[#1a2e1f]">
                Date started
              </label>
              <input
                type="date"
                id="startedAt"
                value={startedAt}
                onChange={(event) => setStartedAt(event.target.value)}
                className="h-11 rounded-md border border-[#c8d9c4] bg-white px-3 text-sm text-[#1a2e1f] outline-none transition focus:border-[#3d6449]"
              />
            </div>
          ) : null}

          {showFinishedAt ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="finishedAt" className="text-sm font-medium text-[#1a2e1f]">
                Date finished
              </label>
              <input
                type="date"
                id="finishedAt"
                value={finishedAt}
                onChange={(event) => setFinishedAt(event.target.value)}
                className="h-11 rounded-md border border-[#c8d9c4] bg-white px-3 text-sm text-[#1a2e1f] outline-none transition focus:border-[#3d6449]"
              />
            </div>
          ) : null}

          {showRating ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#1a2e1f]">Rating</label>
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
                      <Star className={`size-4 ${isActive ? "fill-current" : ""}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {showReview ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="review" className="text-sm font-medium text-[#1a2e1f]">
                Review
              </label>
              <textarea
                id="review"
                value={review}
                onChange={(event) => setReview(event.target.value)}
                placeholder="What did you think?"
                className="min-h-28 rounded-md border border-[#c8d9c4] bg-white px-3 py-3 text-sm text-[#1a2e1f] outline-none transition focus:border-[#3d6449]"
              />
            </div>
          ) : null}

          <div className="flex-1" />

          {error ? (
            <p className="rounded-md border border-[#e0c2c2] bg-[#fff3f3] px-3 py-2 text-sm text-[#9b4b4b]">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-[#d7e3d4] pt-5">
            {props.mode === "edit" ? (
              <Button
                type="button"
                variant="ghost"
                className="text-[#9b4b4b] hover:bg-[#fff3f3] hover:text-[#9b4b4b]"
                disabled={isDeleting || isSaving}
                onClick={handleDelete}
              >
                <Trash2 />
                {isDeleting ? "Removing..." : "Remove"}
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#2d4a35] text-white hover:bg-[#3d6449]"
                disabled={isSaving || isDeleting}
              >
                {props.mode === "edit" ? <Save /> : <Plus />}
                {isSaving ? "Saving..." : props.mode === "edit" ? "Save changes" : "Save book"}
              </Button>
            </div>
          </div>
        </form>
      </aside>
    </div>
  );
}
