"use client";

import { ShelfView } from "@/components/books/shelf-view";

export default function ShelfPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#4a7c59]">
          Shelf
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[#1a2e1f]">
          Your saved books
        </h1>
        <p className="mt-1 max-w-2xl text-base text-[#6b7f6e]">
          Everything you&apos;ve added to your shelf, with reading status and notes.
        </p>
      </div>

      <ShelfView />
    </main>
  );
}
