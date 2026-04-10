import { BookOpen } from "lucide-react";
import type { Book } from "@/types/api";

type BookCardProps = {
  book: Book;
};

function getCoverUrl(coverId: number | null, size: "S" | "M" | "L" = "M") {
  if (!coverId) {
    return null;
  }

  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg?default=false`;
}

export function BookCard({ book }: BookCardProps) {
  const coverUrl = getCoverUrl(book.coverId);

  return (
    <article className="flex overflow-hidden rounded-2xl border border-border bg-card">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={`Cover for ${book.title}`}
          className="h-full w-18 shrink-0 self-stretch object-cover"
        />
      ) : (
        <div className="flex w-18 shrink-0 self-stretch items-center justify-center bg-muted text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <BookOpen className="size-5" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-4">
        <h2 className="truncate text-lg font-semibold">{book.title}</h2>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {book.year ? `${book.year}` : "Year unknown"}
        </p>
      </div>
    </article>
  );
}
