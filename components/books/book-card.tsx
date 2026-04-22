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
    <article className="flex overflow-hidden rounded-md border border-[#c8d9c4] bg-white">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={`Cover for ${book.title}`}
          className="h-full w-18 shrink-0 self-stretch object-cover"
        />
      ) : (
        <div className="flex w-18 shrink-0 self-stretch items-center justify-center bg-[#e8f0e8]">
          <BookOpen className="size-5 text-[#4a7c59]" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-4">
        <h2 className="truncate text-base font-semibold text-[#1a2e1f]">{book.title}</h2>
        <p className="text-sm text-[#6b7f6e]">{book.author}</p>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a8c5a0]">
          {book.year ? `${book.year}` : "Year unknown"}
        </p>
      </div>
    </article>
  );
}
