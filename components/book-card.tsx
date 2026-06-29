import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { formatArticleLevel } from "@/lib/article-metadata";
import type { Book } from "@/lib/books";
import { withBasePath } from "@/lib/site";

export function BookCard({ book, compact = false }: { book: Book; compact?: boolean }) {
  return (
    <article className="group grid h-full min-w-0 gap-5 overflow-hidden rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 sm:grid-cols-[minmax(132px,0.42fr)_minmax(0,1fr)]">
      {book.cover ? (
        <Link
          href={book.url}
          className="block min-w-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"
          aria-label={`${book.title}を読む`}
        >
          <span className="book-cover-card block aspect-video overflow-hidden rounded-md bg-zinc-950 shadow-xl shadow-zinc-950/20 ring-1 ring-zinc-950/10 dark:ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath(book.cover)}
              alt={`${book.title} cover`}
              width={1200}
              height={675}
              loading={compact ? "lazy" : "eager"}
              decoding="async"
              className="block h-full w-full object-cover"
            />
          </span>
        </Link>
      ) : (
        <div className="grid aspect-video place-items-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <BookOpen aria-hidden size={34} />
        </div>
      )}

      <div className="flex min-w-0 flex-col py-1">
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
        <p className="mt-4 line-clamp-3 break-words text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {book.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border border-zinc-200 px-2 py-1 font-mono text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            {formatArticleLevel(book.level)}
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
          Open book
          <ArrowRight aria-hidden size={15} className="transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
