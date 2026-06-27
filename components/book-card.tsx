import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Lock, Unlock } from "lucide-react";
import { formatArticleLevel } from "@/lib/article-metadata";
import { formatBookAccess, type Book } from "@/lib/books";

export function BookCard({ book, compact = false }: { book: Book; compact?: boolean }) {
  const AccessIcon = book.access === "premium" ? Lock : Unlock;

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <BookOpen aria-hidden size={19} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-emerald-700 dark:text-emerald-300">
              {book.category}
            </span>
            <span aria-hidden>・</span>
            <span>Book</span>
          </div>
          <h2
            className={`${compact ? "text-base" : "text-lg"} mt-1 break-words font-semibold leading-7 text-zinc-950 dark:text-zinc-50`}
          >
            <Link
              href={book.url}
              className="outline-none transition group-hover:text-emerald-700 focus-visible:text-emerald-700 dark:group-hover:text-emerald-300 dark:focus-visible:text-emerald-300"
            >
              {book.title}
            </Link>
          </h2>
          <p className="mt-1 break-words text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">
            {book.subtitle}
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 break-words text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {book.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-md border border-zinc-200 px-2 py-1 font-mono text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          {formatArticleLevel(book.level)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <AccessIcon aria-hidden size={12} />
          {formatBookAccess(book.access)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <Clock aria-hidden size={12} />
          {book.readingTimeMinutes} min
        </span>
      </div>
      <Link
        href={book.url}
        className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-emerald-700 dark:text-emerald-300"
      >
        Read book
        <ArrowRight aria-hidden size={15} className="transition group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}
