import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleReader } from "@/components/article-reader";
import { ArticleCard } from "@/components/article-card";
import {
  getAdjacentArticles,
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/articles";
import { getBookForSeries } from "@/lib/books";
import { getSeriesBookDefinition } from "@/lib/series-books";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slugSegments,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  const socialImage = article.thumbnail
    ? {
        url: absoluteUrl(article.thumbnail),
        width: 1200,
        height: 675,
        alt: article.title,
      }
    : {
        url: absoluteUrl("/tech-note-mark.svg"),
        width: 1200,
        height: 630,
        alt: article.title,
      };

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: article.canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: article.canonicalUrl,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      tags: article.tags,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [socialImage.url],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const related = getRelatedArticles(article, 3);
  const adjacent = getAdjacentArticles(article);
  const series = article.series
    ? getSeriesBookDefinition(article.series.slug)
    : undefined;
  const book = article.series
    ? getBookForSeries(article.series.name)
    : undefined;
  return (
    <article className="page-shell reader-shell">
      <ArticleReader article={article} />
      {series || book ? (
        <section className="reading-context">
          <h2>{series ? "シリーズを読み進める" : "ブックでまとめて読む"}</h2>
          <Link href={series ? `/series/${series.slug}` : book!.url}>
            {series?.name ?? book!.title} →
          </Link>
        </section>
      ) : null}
      <nav className="reading-adjacent" aria-label="関連する前後の記事">
        {adjacent.previous ? (
          <Link href={adjacent.previous.url}>
            <span>← 同じテーマの前の記事</span>
            <strong>{adjacent.previous.title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {adjacent.next ? (
          <Link href={adjacent.next.url}>
            <span>同じテーマの次の記事 →</span>
            <strong>{adjacent.next.title}</strong>
          </Link>
        ) : null}
      </nav>
      {related.length ? (
        <section className="related-reading">
          <div className="section-heading">
            <h2>あわせて読む</h2>
          </div>
          {related.map((item) => (
            <ArticleCard key={item.slug} article={item} compact />
          ))}
        </section>
      ) : null}
    </article>
  );
}
