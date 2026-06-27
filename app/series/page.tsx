import type { Metadata } from "next";
import Link from "next/link";
import { Layers3 } from "lucide-react";
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
        <p className="page-subtitle">連続記事を学習順に辿れます。</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {series.map((item) => (
          <Link
            key={item.slug}
            href={`/series/${item.slug}`}
            className="group rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <span className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                <Layers3 aria-hidden size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {item.category}
                </span>
                <span className="mt-1 block break-words text-lg font-semibold leading-7 text-zinc-950 group-hover:text-emerald-700 dark:text-zinc-50 dark:group-hover:text-emerald-300">
                  {item.name}
                </span>
                <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">
                  {item.count} articles
                </span>
              </span>
            </span>
            <ol className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {item.articles.slice(0, 4).map((article) => (
                <li key={article.slug} className="flex min-w-0 items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-sm border border-zinc-300 dark:border-zinc-700" />
                  <span className="min-w-0 break-words">{article.title}</span>
                </li>
              ))}
            </ol>
          </Link>
        ))}
      </div>
    </div>
  );
}
