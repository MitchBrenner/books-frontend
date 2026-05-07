"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

import { BookShelfForm } from "@/components/books/book-shelf-form";
import type { Book, UpdateUserBookInput, UserBook } from "@/types/api";
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

export function SaveBookDrawer(props: SaveBookDrawerProps) {
  const { book, isOpen, onClose } = props;

  if (!book || !isOpen) return null;

  const userBook = props.mode === "edit" ? props.userBook : undefined;

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
              {book.title}
            </h2>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
          <BookShelfForm
            book={book}
            userBook={userBook}
            onSaved={(_, payload) => {
              if (props.mode === "save") props.onSaved(book.id);
              onClose();
            }}
            onUpdated={(userBookId, payload) => {
              if (props.mode === "edit") props.onUpdated(userBookId, payload);
              onClose();
            }}
            onDeleted={(userBookId) => {
              if (props.mode === "edit") props.onDeleted(userBookId);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </motion.aside>
    </motion.div>
  );
}
