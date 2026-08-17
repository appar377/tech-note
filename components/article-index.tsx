import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { Pagination } from "@/components/pagination";
import { getAllArticles, paginateArticles } from "@/lib/articles";

export const ARTICLES_PER_PAGE = 4;

export function ArticleIndex({ page = 1 }: { page?: number }) {
  const allArticles = getAllArticles();
  const paginated = paginateArticles(allArticles, page, ARTICLES_PER_PAGE);

  return (
    <div className="page-shell">
      <header className="mb-10">
        <h1 className="page-heading">記事</h1>
        <p className="page-subtitle">
          精査して公開した記事一覧です。AI対話や日々の気づきはドラフトに分け、
          再構成した長編はブック、共通テーマのまとまりはシリーズとして整理します。
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-lg bg-zinc-950 px-3 py-1.5 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-950">
            公開記事
          </span>
          <Link
            href="/drafts"
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-cyan-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-cyan-700 dark:hover:text-zinc-50"
          >
            ドラフト
          </Link>
          <Link
            href="/notes"
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-cyan-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-cyan-700 dark:hover:text-zinc-50"
          >
            ノート
          </Link>
          <Link
            href="/books"
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-cyan-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-cyan-700 dark:hover:text-zinc-50"
          >
            ブック
          </Link>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {paginated.articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      <div className="mt-10">
        <Pagination currentPage={paginated.currentPage} totalPages={paginated.totalPages} />
      </div>
    </div>
  );
}
