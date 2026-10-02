import Link from "next/link";
import { ArticleThumbnail } from "@/components/article-thumbnail";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/format";

export function ArticleCard({
  article,
  compact = false,
}: {
  article: Article;
  compact?: boolean;
}) {
  return (
    <article className={`article-row${compact ? " article-row--compact" : ""}`}>
      <div className="article-row__body">
        <div className="article-row__meta">
          <Link href={`/categories/${article.categorySlug}`}>
            {article.category}
          </Link>
          <span>{article.readingTimeMinutes}分</span>
        </div>
        <h2>
          <Link href={article.url}>{article.title}</Link>
        </h2>
        <p>{article.description}</p>
        <time dateTime={article.updated ?? article.date}>
          {formatDate(article.updated ?? article.date)}
        </time>
      </div>
      {article.thumbnail && !compact ? (
        <Link
          href={article.url}
          className="article-row__image"
          aria-label={`${article.title}を読む`}
          tabIndex={-1}
        >
          <ArticleThumbnail article={article} framed={false} />
        </Link>
      ) : null}
    </article>
  );
}
