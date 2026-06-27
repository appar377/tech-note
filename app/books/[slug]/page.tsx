import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, CalendarDays, Clock, Folder, ListChecks } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BookReader } from "@/components/book-reader";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/toc";
import { formatArticleLevel } from "@/lib/article-metadata";
import { getAllBooks, getBookBySlug } from "@/lib/books";
import { formatDate } from "@/lib/format";
import { absoluteUrl, withBasePath } from "@/lib/site";

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

  const ogImage = book.cover ?? "/tech-note-mark.svg";

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
          url: absoluteUrl(ogImage),
          width: book.cover ? 960 : 1200,
          height: book.cover ? 1280 : 630,
          alt: book.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.description,
      images: [absoluteUrl(ogImage)],
    },
  };
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const chapterCount = book.headings.filter((heading) => heading.depth === 2).length;

  return (
    <article className="page-shell">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Books", href: "/books" }, { label: book.title }]} />
      <header className="book-hero mt-8">
        <div className="book-hero__cover">
          {book.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={withBasePath(book.cover)}
              alt={`${book.title} cover`}
              width={960}
              height={1280}
              loading="eager"
              decoding="async"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-emerald-300">
              <BookOpen aria-hidden size={48} />
            </span>
          )}
        </div>

        <div className="book-hero__body">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-medium text-emerald-100 ring-1 ring-white/10">
              <BookOpen aria-hidden size={15} />
              Book
            </span>
            <span className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1.5 font-mono text-xs font-medium text-zinc-300 ring-1 ring-white/10">
              {formatArticleLevel(book.level)}
            </span>
            <Link
              href={`/categories/${book.categorySlug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-medium text-zinc-200 ring-1 ring-white/10 transition hover:bg-white/15 hover:text-white"
            >
              <Folder aria-hidden size={15} />
              {book.category}
            </Link>
          </div>
          <h1 className="max-w-4xl break-words text-4xl font-semibold leading-tight text-white sm:text-6xl">
            {book.title}
          </h1>
          <p className="mt-5 max-w-3xl break-words text-xl font-medium leading-8 text-zinc-100">
            {book.subtitle}
          </p>
          <p className="mt-4 max-w-3xl break-words text-base leading-8 text-zinc-300 sm:text-lg">
            {book.description}
          </p>
          <div className="mt-8 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
            <span className="book-hero__metric">
              <CalendarDays aria-hidden size={16} />
              {formatDate(book.date)}
            </span>
            <span className="book-hero__metric">
              <Clock aria-hidden size={16} />
              {book.readingTimeMinutes} min read
            </span>
            <span className="book-hero__metric">
              <ListChecks aria-hidden size={16} />
              {chapterCount} chapters
            </span>
          </div>
          {book.updated ? (
            <p className="mt-4 text-sm text-zinc-400">Updated {formatDate(book.updated)}</p>
          ) : null}
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          <BookReader chapters={book.headings}>
            <div className="book-prose prose max-w-none">
              <MdxContent source={book.content} />
            </div>
          </BookReader>
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
