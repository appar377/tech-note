import type { Metadata } from "next";
import Link from "next/link";
import { getReviewArticles } from "@/lib/draft-preview";

export const metadata: Metadata = {
  title: "下書き",
  description: "公開前の原稿。",
  robots: { index: false, follow: false },
};

export default function DraftsPage() {
  const drafts = getReviewArticles();
  return (
    <div className="page-shell narrow-collection">
      <header className="collection-header">
        <h1 className="page-heading">下書き</h1>
        <p className="page-subtitle">公開前の原稿を読む。</p>
      </header>
      {drafts.length ? (
        <div className="article-list">
          {drafts.map((article) => (
            <article key={article.slug} className="article-row">
              <div className="article-row__body">
                <div className="article-row__meta">
                  <span>レビュー待ち</span>
                  <span>{article.category}</span>
                  <span>{article.readingTimeMinutes}分</span>
                </div>
                <h2>
                  <Link
                    href={{
                      pathname: "/drafts/review",
                      query: { article: article.slug },
                    }}
                  >
                    {article.title}
                  </Link>
                </h2>
                <p>{article.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>ここで読める下書きはありません。</p>
          <Link className="text-link" href="/articles">
            公開記事を読む →
          </Link>
        </div>
      )}
    </div>
  );
}
