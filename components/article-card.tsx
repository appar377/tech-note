import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { slugify } from "@/lib/slug";

export function ArticleCard({
  article,
  compact = false,
}: {
  article: Article;
  compact?: boolean;
}) {
  return (
    <article className="group flex h-full min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href={`/categories/${article.categorySlug}`}
          className="rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
        >
          {article.category}
        </Link>
        {article.series ? (
          <Link
            href={`/series/${article.series.slug}`}
            className="min-w-0 truncate rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950"
          >
            {article.series.name}
          </Link>
        ) : null}
      </div>
      <h2 className={`${compact ? "text-base" : "text-lg"} min-w-0 break-all font-semibold leading-7 text-zinc-950 dark:text-zinc-50`}>
        <Link href={article.url} className="outline-none transition group-hover:text-emerald-700 focus-visible:text-emerald-700 dark:group-hover:text-emerald-300 dark:focus-visible:text-emerald-300">
          {article.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {article.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.slice(0, 4).map((tag) => (
          <Link
            key={tag}
            href={`/tags/${slugify(tag)}`}
            className="max-w-full break-words rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
          >
            #{tag}
          </Link>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-xs text-zinc-500 dark:text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays aria-hidden size={14} />
          {formatDate(article.date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden size={14} />
          {article.readingTimeMinutes} min
        </span>
      </div>
    </article>
  );
}
