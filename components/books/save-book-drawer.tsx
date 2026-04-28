"use client";

import { type SyntheticEvent, useEffect, useMemo, useState } from "react";
import { Plus, Save, Star, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  deleteMyBook,
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

  const initialStatus =
    props.mode === "edit" ? props.userBook.status : "want_to_read";
  const initialRating =
    props.mode === "edit" ? (props.userBook.rating ?? null) : null;
  const initialReview =
    props.mode === "edit" ? (props.userBook.review ?? "") : "";
  const initialStartedAt =
    props.mode === "edit" ? toDateInputValue(props.userBook.startedAt) : "";
  const initialFinishedAt =
    props.mode === "edit" ? toDateInputValue(props.userBook.finishedAt) : "";

  const [status, setStatus] = useState<UserBookStatus>(initialStatus);
  const [rating, setRating] = useState<number | null>(initialRating);
  const [review, setReview] = useState(initialReview);
  const [startedAt, setStartedAt] = useState(initialStartedAt);
  const [finishedAt, setFinishedAt] = useState(initialFinishedAt);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
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
          startedAt: showStartedAt ? startedAt || null : null,
          finishedAt: showFinishedAt ? finishedAt || null : null,
        };
        await updateMyBook(props.userBook.id, payload);
        props.onUpdated(props.userBook.id, payload);
        toast.success(`"${title}" updated`);
      } else {
        const payload: CreateUserBookInput = {
          bookId: book.id,
          status,
          rating: showRating ? rating : null,
          review: review.trim() || null,
          startedAt: showStartedAt ? startedAt || null : null,
          finishedAt: showFinishedAt ? finishedAt || null : null,
        };
        await saveBookToMyShelf(payload);
        props.onSaved(book.id);
        toast.success(`"${title}" added to your shelf`);
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
      toast.success(`"${title}" removed from your shelf`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Close drawer"
        className="flex-1 cursor-default"
        onClick={onClose}
      />

      <motion.aside
        className="flex h-full w-full max-w-md flex-col border-l border-gray-100 bg-white shadow-xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              {props.mode === "edit" ? "Edit book" : "Save to shelf"}
            </p>
            <h2 className="truncate text-lg font-semibold text-black">
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
          className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm font-medium text-gray-900">
              Reading status
            </label>
            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as UserBookStatus)
              }
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-black"
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
              <label htmlFor="startedAt" className="text-sm font-medium text-gray-900">
                Date started
              </label>
              <input
                type="date"
                id="startedAt"
                value={startedAt}
                onChange={(event) => setStartedAt(event.target.value)}
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
                onChange={(event) => setFinishedAt(event.target.value)}
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
                onChange={(event) => setReview(event.target.value)}
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

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
            {props.mode === "edit" ? (
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
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800"
                disabled={isSaving || isDeleting}
              >
                {props.mode === "edit" ? <Save /> : <Plus />}
                {isSaving
                  ? "Saving..."
                  : props.mode === "edit"
                    ? "Save changes"
                    : "Save book"}
              </Button>
            </div>
          </div>
        </form>
      </motion.aside>
    </motion.div>
  );
}
