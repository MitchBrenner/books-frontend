import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Book } from "@/types/api";

type BookCardProps = {
  book: Book;
  action?: ReactNode;
  subtitle?: ReactNode;
  href?: string;
};

export function BookCard({ book, action, subtitle, href }: BookCardProps) {
  const coverUrl = book.coverUrl;

  const cover = coverUrl ? (
    <div className="w-20 shrink-0 self-stretch overflow-hidden">
      <img
        src={coverUrl}
        alt={`Cover for ${book.title}`}
        className="h-full w-full object-cover"
      />
    </div>
  ) : (
    <div className="flex w-20 shrink-0 self-stretch items-center justify-center bg-gray-50">
      <BookOpen className="size-4 text-gray-300" />
    </div>
  );

  const text = (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 px-4 py-3.5">
      <h2 className="truncate text-sm font-semibold text-black">{book.title}</h2>
      {book.subtitle ? (
        <p className="truncate text-xs text-gray-400">{book.subtitle}</p>
      ) : null}
      <p className="text-sm text-gray-500">{book.author}</p>
      {book.year ? <p className="text-xs text-gray-400">{book.year}</p> : null}
      {subtitle ? <div className="pt-1.5">{subtitle}</div> : null}
    </div>
  );

  return (
    <article className="flex overflow-hidden rounded-xl border border-gray-100 bg-white">
      {href ? (
        <Link href={href} className="flex min-w-0 flex-1">
          {cover}
          {text}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1">
          {cover}
          {text}
        </div>
      )}
      {action ? (
        <div className="flex shrink-0 items-center pr-4">{action}</div>
      ) : null}
    </article>
  );
}
