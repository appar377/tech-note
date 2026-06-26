import type { Metadata } from "next";
import Link from "next/link";
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
            className="rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{item.name}</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{item.count} articles</p>
            <ol className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {item.articles.slice(0, 4).map((article) => (
                <li key={article.slug}>{article.title}</li>
              ))}
            </ol>
          </Link>
        ))}
      </div>
    </div>
  );
}
