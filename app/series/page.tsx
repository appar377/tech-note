import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers3 } from "lucide-react";
import { getSeries } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Series",
  description: "Tech Noteのシリーズ記事一覧。",
  alternates: {
    canonical: absoluteUrl("/series"),
  },
};

export default function SeriesPage() {
  const series = getSeries();

  return (
    <div className="page-shell">
      <header className="mb-10">
        <h1 className="page-heading">Series</h1>
        <p className="page-subtitle">
          1つのテーマを章立てで読み進め、到達点まで辿るための技術書ページです。
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {series.map((item) => (
          <Link
            key={item.slug}
            href={`/series/${item.slug}`}
            className="group flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <span className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <BookOpen aria-hidden size={18} />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <span>{item.category}</span>
                  <span aria-hidden>・</span>
                  <span>Book Series</span>
                </span>
                <span className="mt-1 block break-words text-lg font-semibold leading-7 text-zinc-950 group-hover:text-emerald-700 dark:text-zinc-50 dark:group-hover:text-emerald-300">
                  {item.name}
                </span>
                <span className="mt-1 block break-words text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                  {item.subtitle}
                </span>
              </span>
            </span>
            <span className="mt-4 block break-words text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {item.description}
            </span>
            <span className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <span className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/70">
                <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  <Layers3 aria-hidden size={14} />
                  Chapters
                </span>
                <span className="mt-1 block font-mono text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  {item.count}
                </span>
              </span>
              <span className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/70">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  Goal
                </span>
                <span className="mt-1 line-clamp-2 block break-words text-zinc-700 dark:text-zinc-300">
                  {item.goal}
                </span>
              </span>
            </span>
            <ol className="mt-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {item.articles.slice(0, 3).map((article, index) => (
                <li key={article.slug} className="flex min-w-0 items-start gap-2">
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-emerald-700 dark:text-emerald-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 break-words">{article.title}</span>
                </li>
              ))}
            </ol>
            <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Read as a book
              <ArrowRight
                aria-hidden
                size={15}
                className="transition group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
