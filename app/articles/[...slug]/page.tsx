import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Folder, Tags } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MdxContent } from "@/components/mdx-content";
import { ShareLinks } from "@/components/share-links";
import { TableOfContents } from "@/components/toc";
import {
  displaySegment,
  getAdjacentArticles,
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { slugify } from "@/lib/slug";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slugSegments,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

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
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article);
  const adjacentArticles = getAdjacentArticles(article);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: article.category, href: `/categories/${article.categorySlug}` },
    ...article.slugSegments.slice(0, -1).map((segment) => ({
      label: displaySegment(segment),
    })),
    { label: article.title },
  ];

  return (
    <article className="page-shell">
      <Breadcrumbs items={crumbs} />
      <header className="mt-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <Link
            href={`/categories/${article.categorySlug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <Folder aria-hidden size={15} />
            {article.category}
          </Link>
          {article.series ? (
            <Link
              href={`/series/${article.series.slug}`}
              className="rounded-lg bg-blue-50 px-3 py-1.5 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
            >
              {article.series.name}
            </Link>
          ) : null}
        </div>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {article.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden size={16} />
            {formatDate(article.date)}
          </span>
          {article.updated ? <span>Updated {formatDate(article.updated)}</span> : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden size={16} />
            {article.readingTimeMinutes} min read
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Tags aria-hidden size={16} className="text-zinc-400" />
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${slugify(tag)}`}
              className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <ShareLinks title={article.title} url={article.canonicalUrl} editUrl={article.editUrl} />
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="prose max-w-none">
          <MdxContent source={article.content} />
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <TableOfContents headings={article.headings} />
        </aside>
      </div>

      <nav className="mt-12 grid gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 md:grid-cols-2">
        {adjacentArticles.previous ? (
          <Link className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950" href={adjacentArticles.previous.url}>
            <span className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
              <ArrowLeft aria-hidden size={15} />
              Previous
            </span>
            <span className="mt-2 block font-semibold text-zinc-950 dark:text-zinc-50">
              {adjacentArticles.previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {adjacentArticles.next ? (
          <Link className="rounded-lg border border-zinc-200 bg-white p-4 text-right dark:border-zinc-800 dark:bg-zinc-950" href={adjacentArticles.next.url}>
            <span className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
              Next
              <ArrowRight aria-hidden size={15} />
            </span>
            <span className="mt-2 block font-semibold text-zinc-950 dark:text-zinc-50">
              {adjacentArticles.next.title}
            </span>
          </Link>
        ) : null}
      </nav>

      {relatedArticles.length > 0 ? (
        <section className="mt-12">
          <h2 className="section-title">Related Articles</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.slug} article={relatedArticle} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
