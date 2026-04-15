"use client";

import { BookCard } from "@/components/books/book-card";
import { AppNav } from "@/components/navigation/app-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/use-auth";
import type { Book } from "@/types/api";
import { useState } from "react";
import Login from "../login/page";
import { getBooksByQuery } from "@/lib/api/books";

export default function SearchPage() {
  const { user, isLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Login />;
  }

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const data: Book[] = await getBooksByQuery(query);
      setBooks(data);
      setHasSearched(true);
    } catch {
      console.error("error");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Search
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Find your next book
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Search the catalog and start building your shelf.
        </p>

        <form onSubmit={handleSearch} className="flex w-full max-w-2xl gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        {books.length > 0 ? (
          <div className="grid gap-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : null}

        {hasSearched && books.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No matches found for that search.
          </p>
        ) : null}
      </main>
    </div>
  );
}
