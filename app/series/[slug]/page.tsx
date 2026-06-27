import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Square } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatArticleLevel, formatArticleType } from "@/lib/article-metadata";
import { getArticlesBySeries, getSeries } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getSeries().map((series) => ({
    slug: series.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeries().find((item) => item.slug === slug);

  if (!series) return {};

  return {
    title: series.name,
    description: `${series.name} のシリーズ記事一覧。`,
    alternates: {
      canonical: absoluteUrl(`/series/${series.slug}`),
    },
  };
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const series = getSeries().find((item) => item.slug === slug);
  const articles = getArticlesBySeries(slug);

  if (!series) {
    notFound();
  }

  return (
    <div className="page-shell">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Series", href: "/series" }, { label: series.name }]} />
      <header className="mb-10 mt-8">
        <p className="mb-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {series.category}
        </p>
        <h1 className="page-heading">{series.name}</h1>
        <p className="page-subtitle">
          公開済みの{series.count}本を、学習順に辿れるチェックリスト形式で表示します。
        </p>
      </header>
      <ol className="space-y-3">
        {articles.map((article, index) => (
          <li
            key={article.slug}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <Link href={article.url} className="grid min-w-0 gap-4 sm:grid-cols-[64px_1fr]">
              <span className="flex items-center gap-3">
                <Square aria-hidden size={18} className="text-zinc-400" />
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-100 font-mono text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  {article.series?.order ?? index + 1}
                </span>
              </span>
              <span className="min-w-0">
                <span className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md border border-zinc-200 px-2 py-1 font-mono text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    {formatArticleLevel(article.level)}
                  </span>
                  <span className="rounded-md border border-zinc-200 px-2 py-1 font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    {formatArticleType(article.articleType)}
                  </span>
                </span>
                <span className="block break-words text-lg font-semibold leading-7 text-zinc-950 dark:text-zinc-50">
                  {article.title}
                </span>
                <span className="mt-1 block break-words text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {article.description}
                </span>
                <span className="mt-3 block text-xs text-zinc-500 dark:text-zinc-500">
                  {formatDate(article.date)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
