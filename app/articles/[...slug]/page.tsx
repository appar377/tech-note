import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Folder, Tags } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { ArticleThumbnail } from "@/components/article-thumbnail";
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
import { absoluteUrl } from "@/lib/site";
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

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article);
  const adjacentArticles = getAdjacentArticles(article);
  const visibleTags = article.tags.slice(0, 4);
  const hiddenTagCount = Math.max(0, article.tags.length - visibleTags.length);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: article.category, href: `/categories/${article.categorySlug}` },
    ...article.slugSegments.slice(0, -1).map((segment) => ({
      label: displaySegment(segment),
    })),
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
              className="max-w-full truncate rounded-lg bg-blue-50 px-3 py-1.5 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
            >
              {article.series.name}
            </Link>
          ) : null}
        </div>
        <h1 className="max-w-4xl break-all text-2xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          <ResponsiveText text={article.title} maxUnits={14} />
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg">
          <ResponsiveText text={article.description} maxUnits={22} />
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
        <div className="mt-6 flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-2 sm:max-w-none">
          <Tags aria-hidden size={16} className="text-zinc-400" />
          {visibleTags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${slugify(tag)}`}
              className="max-w-full break-words rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
            >
              #{tag}
            </Link>
          ))}
          {hiddenTagCount > 0 ? (
            <span className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              +{hiddenTagCount}
            </span>
          ) : null}
        </div>
        <div className="mt-6">
          <ShareLinks title={article.title} url={article.canonicalUrl} />
        </div>
        {article.thumbnail ? (
          <div className="mt-8 max-w-4xl">
            <ArticleThumbnail article={article} priority />
          </div>
        ) : null}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="prose min-w-0 max-w-none">
          <MdxContent source={article.content} />
        </div>
        <aside className="order-first lg:sticky lg:top-24 lg:order-none lg:self-start">
          <TableOfContents headings={article.headings} />
        </aside>
      </div>

      <nav className="mt-12 grid gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 md:grid-cols-2">
        {adjacentArticles.previous ? (
          <Link
            className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            href={adjacentArticles.previous.url}
          >
            <span className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
              <ArrowLeft aria-hidden size={15} />
              Previous
            </span>
            <span className="mt-2 block break-words font-semibold text-zinc-950 dark:text-zinc-50">
              {adjacentArticles.previous.title}
            </span>
          </Link>
        ) : (
          <span className="hidden md:block" />
        )}
        {adjacentArticles.next ? (
          <Link
            className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 text-right shadow-sm shadow-zinc-950/5 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            href={adjacentArticles.next.url}
          >
            <span className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
              Next
              <ArrowRight aria-hidden size={15} />
            </span>
            <span className="mt-2 block break-words font-semibold text-zinc-950 dark:text-zinc-50">
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

function ResponsiveText({ text, maxUnits }: { text: string; maxUnits: number }) {
  return chunkText(text, maxUnits).map((chunk, index) => (
    <span key={`${chunk}-${index}`} className="block sm:inline">
      {chunk}
    </span>
  ));
}

function chunkText(text: string, maxUnits: number) {
  const chunks: string[] = [];
  let current = "";
  let units = 0;

  for (const character of Array.from(text)) {
    const nextUnits = units + displayUnits(character);

    if (current && nextUnits > maxUnits) {
      chunks.push(current);
      current = "";
      units = 0;
    }

    current += character;
    units += displayUnits(character);
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function displayUnits(character: string) {
  return /^[\x00-\x7F]$/.test(character) ? 0.55 : 1;
}
