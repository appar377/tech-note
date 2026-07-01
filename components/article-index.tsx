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
        <h1 className="page-heading">Articles</h1>
        <p className="page-subtitle">
          ラフなメモを精査し、単体で読み切れるように整えた公開記事です。
          思考途中の記録はNotes、目的別に再構成した長編はBooksに分けています。
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-lg bg-zinc-950 px-3 py-1.5 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-950">
            公開記事
          </span>
          <Link
            href="/notes"
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-cyan-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-cyan-700 dark:hover:text-zinc-50"
          >
            雑記メモ
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
