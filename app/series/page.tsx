import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  FileCode2,
  Layers3,
  Network,
  Route,
  Tags,
} from "lucide-react";
import { ArticleThumbnail } from "@/components/article-thumbnail";
import { getSeries, type Article, type SeriesItem } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";
import { slugify } from "@/lib/slug";

export const metadata: Metadata = {
  title: "シリーズ",
  description: "共通テーマの記事をまとめて辿るシリーズ一覧。",
  alternates: {
    canonical: absoluteUrl("/series"),
  },
};

export default function SeriesPage() {
  const series = getSeries();
  const primarySeries =
    series.find((item) => item.slug === "world-file-extensions") ?? series[0];

  if (!primarySeries) {
    return (
      <div className="page-shell">
        <header className="mb-8">
          <p className="tech-pill mb-3 gap-2 text-sm">
            <Layers3 aria-hidden size={15} />
            Series
          </p>
          <h1 className="page-heading">シリーズ</h1>
          <p className="page-subtitle">
            共通テーマの記事をまとめて辿る入口です。公開済みの記事があるシリーズだけを表示します。
          </p>
        </header>
        <div className="tech-card rounded-xl border p-8">
          <Layers3 aria-hidden size={24} className="text-cyan-700 dark:text-cyan-300" />
          <h2 className="mt-4 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            まだ公開済みのシリーズはありません
          </h2>
        </div>
      </div>
    );
  }

  const selectedArticle = primarySeries.articles[0];
  const conceptNodes = buildConceptNodes(primarySeries, selectedArticle);

  return (
    <div className="page-shell">
      <header className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.68fr] lg:items-end">
        <div>
          <p className="tech-pill mb-3 gap-2 text-sm">
            <Layers3 aria-hidden size={15} />
            Series Library
          </p>
          <h1 className="page-heading">テーマで記事を束ねる</h1>
          <p className="page-subtitle">
            シリーズは本ではなく、共通テーマの記事を同じ観点で並べる図鑑です。拡張子のように、1テーマの中で1項目ずつ記事を増やしていきます。
          </p>
        </div>
        <div className="tech-card rounded-xl border p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Published Series
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <SeriesStat label="Series" value={series.length} />
            <SeriesStat label="Articles" value={primarySeries.count} />
            <SeriesStat label="Category" value={primarySeries.category} compact />
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)_280px]">
        <aside className="space-y-4">
          <div className="tech-card rounded-xl border p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              <Route aria-hidden size={15} />
              Series
            </p>
            <div className="space-y-2">
              {series.map((item) => (
                <Link
                  key={item.slug}
                  href={`/series/${item.slug}`}
                  className={`block rounded-lg border p-3 transition ${
                    item.slug === primarySeries.slug
                      ? "border-cyan-300 bg-cyan-500/10 text-cyan-800 dark:border-cyan-400/50 dark:text-cyan-200"
                      : "border-zinc-200 bg-white/60 hover:border-cyan-300 hover:bg-cyan-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-400/50"
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.name}</span>
                  <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                    {item.count} articles
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="tech-card rounded-xl border p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              <BookOpenCheck aria-hidden size={15} />
              Reading Rule
            </p>
            <ul className="space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              <li>公開済みの記事だけを表示</li>
              <li>1テーマを同じ観点で整理</li>
              <li>Bookとは分けて、記事のまとまりとして扱う</li>
            </ul>
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <section className="tech-card overflow-hidden rounded-xl border">
            <div className="grid gap-0 lg:grid-cols-[0.72fr_1fr]">
              <div className="min-w-0 bg-zinc-950 p-4 dark:bg-black">
                {selectedArticle ? (
                  <ArticleThumbnail article={selectedArticle} priority framed={false} />
                ) : (
                  <div className="grid aspect-video place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-sm text-zinc-400">
                    No thumbnail
                  </div>
                )}
              </div>
              <div className="min-w-0 p-5 sm:p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                  {primarySeries.category} / Theme Series
                </p>
                <h2 className="break-words text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {primarySeries.name}
                </h2>
                <p className="mt-3 break-words text-lg font-medium leading-8 text-zinc-700 dark:text-zinc-300">
                  {primarySeries.subtitle}
                </p>
                <p className="mt-4 break-words text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {primarySeries.description}
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <MiniMetric label="目的" value={primarySeries.goal} />
                  <MiniMetric label="公開記事" value={`${primarySeries.count} 本`} />
                  <MiniMetric label="並び順" value="series.order" />
                </div>
              </div>
            </div>
          </section>

          <section className="tech-card rounded-xl border p-4 sm:p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  知識マップ
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  公開済み記事と、その記事に紐づくタグをノードとして表示します。
                </p>
              </div>
              <Link
                href={`/series/${primarySeries.slug}`}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-500/15 dark:border-cyan-400/30 dark:text-cyan-300"
              >
                詳細ページへ
                <ArrowRight aria-hidden size={15} />
              </Link>
            </div>
            <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {conceptNodes.map((node, index) => (
                <Link
                  key={`${node.href}-${node.label}-${index}`}
                  href={node.href}
                  className={`group min-w-0 rounded-xl border p-4 transition hover:-translate-y-0.5 ${
                    node.kind === "article"
                      ? "border-cyan-300 bg-cyan-500/10 dark:border-cyan-400/40"
                      : "border-zinc-200 bg-white/60 dark:border-white/10 dark:bg-white/[0.04]"
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                    {node.kind === "article" ? <FileCode2 aria-hidden size={14} /> : <Tags aria-hidden size={14} />}
                    {node.kind}
                  </span>
                  <span className="mt-3 block break-words text-lg font-semibold text-zinc-950 group-hover:text-cyan-700 dark:text-zinc-50 dark:group-hover:text-cyan-300">
                    {node.label}
                  </span>
                  <span className="mt-2 line-clamp-2 block break-words text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {node.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="tech-card rounded-xl border p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              公開済み記事
            </h2>
            <div className="mt-4 divide-y divide-zinc-100 dark:divide-white/10">
              {primarySeries.articles.map((article, index) => (
                <SeriesArticleRow key={article.slug} article={article} index={index} />
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-4">
          {selectedArticle ? (
            <div className="tech-card rounded-xl border p-4">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                <FileCode2 aria-hidden size={15} />
                Selected
              </p>
              <Link href={selectedArticle.url} className="group block">
                <span className="block text-xl font-semibold text-zinc-950 group-hover:text-cyan-700 dark:text-zinc-50 dark:group-hover:text-cyan-300">
                  {selectedArticle.title}
                </span>
                <span className="mt-2 line-clamp-3 block text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {selectedArticle.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700 dark:text-cyan-300">
                  記事を読む
                  <ArrowRight aria-hidden size={15} />
                </span>
              </Link>
            </div>
          ) : null}

          <div className="tech-card rounded-xl border p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              <Network aria-hidden size={15} />
              Outcomes
            </p>
            <ul className="space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {primarySeries.outcomes.slice(0, 5).map((outcome) => (
                <li key={outcome} className="rounded-lg bg-cyan-500/10 p-3">
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          <div className="tech-card rounded-xl border p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Concept
            </p>
            <p className="break-words text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {primarySeries.concept}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function buildConceptNodes(series: SeriesItem, selectedArticle?: Article) {
  const articleNodes = series.articles.map((article) => ({
    label: article.title,
    description: article.description,
    href: article.url,
    kind: "article" as const,
  }));

  const tagNodes =
    selectedArticle?.tags.slice(0, 5).map((tag) => ({
      label: `#${tag}`,
      description: `${series.name} と関連する検索タグ`,
      href: `/tags/${slugify(tag)}`,
      kind: "tag" as const,
    })) ?? [];

  return [...articleNodes, ...tagNodes].slice(0, 9);
}

function SeriesStat({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: number | string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <span className={`block font-semibold text-zinc-950 dark:text-zinc-50 ${compact ? "text-sm" : "font-mono text-lg"}`}>
        {value}
      </span>
      <span className="mt-1 block text-[11px] text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-cyan-500/10 p-3">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <span className="mt-1 line-clamp-2 block break-words text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {value}
      </span>
    </div>
  );
}

function SeriesArticleRow({ article, index }: { article: Article; index: number }) {
  return (
    <Link
      href={article.url}
      className="grid gap-3 py-4 transition hover:text-cyan-700 sm:grid-cols-[auto_1fr_auto] dark:hover:text-cyan-300"
    >
      <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <span className="block break-words text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          {article.title}
        </span>
        <span className="mt-1 line-clamp-1 block text-xs text-zinc-500 dark:text-zinc-400">
          {article.description}
        </span>
      </span>
      <span className="text-xs text-zinc-500 dark:text-zinc-500">{formatDate(article.date)}</span>
    </Link>
  );
}
