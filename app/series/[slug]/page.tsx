import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
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
        <h1 className="page-heading">{series.name}</h1>
        <p className="page-subtitle">{series.count} articles</p>
      </header>
      <ol className="space-y-4">
        {articles.map((article, index) => (
          <li key={article.slug} className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <Link href={article.url} className="grid gap-4 sm:grid-cols-[48px_1fr]">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-zinc-100 font-mono text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                {article.series?.order ?? index + 1}
              </span>
              <span>
                <span className="block text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  {article.title}
                </span>
                <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
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
