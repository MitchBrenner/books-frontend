import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";
import type { Book } from "@/types/api";

type BookCardProps = {
  book: Book;
  action?: ReactNode;
  subtitle?: ReactNode;
};

function getCoverUrl(coverId: number | null, size: "S" | "M" | "L" = "M") {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg?default=false`;
}

export function BookCard({ book, action, subtitle }: BookCardProps) {
  const coverUrl = getCoverUrl(book.coverId);

  return (
    <article className="flex overflow-hidden rounded-xl border border-gray-100 bg-white">
      {coverUrl ? (
        <div className="w-16 shrink-0 self-stretch overflow-hidden">
          <img
            src={coverUrl}
            alt={`Cover for ${book.title}`}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex w-16 shrink-0 self-stretch items-center justify-center bg-gray-50">
          <BookOpen className="size-4 text-gray-300" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="truncate text-sm font-semibold text-black">
            {book.title}
          </h2>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        <p className="text-sm text-gray-500">{book.author}</p>
        {book.year ? <p className="text-xs text-gray-400">{book.year}</p> : null}
        {subtitle ? <div className="pt-1.5">{subtitle}</div> : null}
      </div>
    </article>
  );
}
