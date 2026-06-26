import { ArticleCard } from "@/components/article-card";
import { Pagination } from "@/components/pagination";
import { getAllArticles, paginateArticles } from "@/lib/articles";

export const ARTICLES_PER_PAGE = 3;

export function ArticleIndex({ page = 1 }: { page?: number }) {
  const allArticles = getAllArticles();
  const paginated = paginateArticles(allArticles, page, ARTICLES_PER_PAGE);

  return (
    <div className="page-shell">
      <header className="mb-10">
        <h1 className="page-heading">Articles</h1>
        <p className="page-subtitle">
          Gitで管理されたMDX記事を、カテゴリ・タグ・シリーズで横断できる技術ノート。
        </p>
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
