import Link from "next/link";
import { ArticleThumbnail } from "./article-thumbnail";
import { MdxContent } from "./mdx-content";
import { TableOfContents } from "./toc";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/format";

export function ArticleReader({
  article,
  review = false,
  collection = "articles",
}: {
  article: Pick<
    Article,
    | "title"
    | "description"
    | "updated"
    | "date"
    | "category"
    | "categorySlug"
    | "readingTimeMinutes"
    | "content"
    | "headings"
    | "thumbnail"
  >;
  review?: boolean;
  collection?: "articles" | "notes";
}) {
  return (
    <>
      <header className="reader-heading">
        <nav className="reader-breadcrumb" aria-label="パンくず">
          <Link href={review ? "/drafts" : `/${collection}`}>
            {review ? "下書き" : collection === "notes" ? "ノート" : "記事"}
          </Link>
          <span aria-hidden>/</span>
          {collection === "notes" ? (
            <span>{article.category}</span>
          ) : (
            <Link href={`/categories/${article.categorySlug}`}>
              {article.category}
            </Link>
          )}
        </nav>
        {review ? (
          <p className="review-notice">レビュー用の下書き · 未公開</p>
        ) : null}
        <h1>{article.title}</h1>
        <p className="reader-description">{article.description}</p>
        <div className="reader-meta">
          <time dateTime={article.updated ?? article.date}>
            {article.updated ? "更新 " : ""}
            {formatDate(article.updated ?? article.date)}
          </time>
          <span>{article.readingTimeMinutes}分で読めます</span>
        </div>
        {review && !article.thumbnail ? (
          <p className="reader-meta">表紙画像は未反映です。</p>
        ) : null}
        {article.thumbnail ? (
          <div className="reader-cover">
            <ArticleThumbnail article={article} priority framed={false} />
          </div>
        ) : null}
      </header>
      <div className="reading-layout">
        <div className="prose reading-prose">
          <MdxContent source={article.content} />
        </div>
        <aside>
          <TableOfContents headings={article.headings} />
        </aside>
      </div>
    </>
  );
}
