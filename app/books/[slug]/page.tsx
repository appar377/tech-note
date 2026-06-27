import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, CalendarDays, Clock, Folder, Lock, Unlock } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/toc";
import { formatArticleLevel } from "@/lib/article-metadata";
import { formatBookAccess, getAllBooks, getBookBySlug } from "@/lib/books";
import { formatDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllBooks().map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) return {};

  return {
    title: book.title,
    description: book.description,
    alternates: {
      canonical: book.canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: book.canonicalUrl,
      title: book.title,
      description: book.description,
      publishedTime: book.date,
      modifiedTime: book.updated ?? book.date,
      images: [
        {
          url: absoluteUrl("/tech-note-mark.svg"),
          width: 1200,
          height: 630,
          alt: book.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.description,
      images: [absoluteUrl("/tech-note-mark.svg")],
    },
  };
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const AccessIcon = book.access === "premium" ? Lock : Unlock;

  return (
    <article className="page-shell">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Books", href: "/books" }, { label: book.title }]} />
      <header className="mt-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <BookOpen aria-hidden size={15} />
            Book
          </span>
          <span className="inline-flex items-center rounded-lg border border-zinc-200 px-3 py-1.5 font-mono text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            {formatArticleLevel(book.level)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <AccessIcon aria-hidden size={14} />
            {formatBookAccess(book.access)}
          </span>
          <Link
            href={`/categories/${book.categorySlug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
          >
            <Folder aria-hidden size={15} />
            {book.category}
          </Link>
        </div>
        <h1 className="max-w-4xl break-words text-3xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          {book.title}
        </h1>
        <p className="mt-5 max-w-3xl break-words text-xl font-medium leading-8 text-zinc-800 dark:text-zinc-200">
          {book.subtitle}
        </p>
        <p className="mt-4 max-w-3xl break-words text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg">
          {book.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden size={16} />
            {formatDate(book.date)}
          </span>
          {book.updated ? <span>Updated {formatDate(book.updated)}</span> : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden size={16} />
            {book.readingTimeMinutes} min read
          </span>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="book-prose prose min-w-0 max-w-none">
          <MdxContent source={book.content} />
        </main>
        <aside className="order-first space-y-8 lg:sticky lg:top-24 lg:order-none lg:self-start">
          <TableOfContents headings={book.headings} />
          {book.references.length > 0 ? (
            <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Reference Articles
              </h2>
              <ul className="mt-3 space-y-3 text-sm leading-6">
                {book.references.map((reference) => (
                  <li key={`${reference.href}-${reference.title}`} className="min-w-0">
                    {reference.href.startsWith("http") ? (
                      <a
                        href={reference.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-words font-medium text-zinc-950 transition hover:text-emerald-700 dark:text-zinc-50 dark:hover:text-emerald-300"
                      >
                        {reference.title}
                      </a>
                    ) : (
                      <Link
                        href={reference.href}
                        className="block break-words font-medium text-zinc-950 transition hover:text-emerald-700 dark:text-zinc-50 dark:hover:text-emerald-300"
                      >
                        {reference.title}
                      </Link>
                    )}
                    {reference.note ? (
                      <span className="mt-1 block break-words text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                        {reference.note}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
