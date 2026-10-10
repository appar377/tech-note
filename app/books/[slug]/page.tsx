import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookReader } from "@/components/book-reader";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/toc";
import { getAllBooks, getBookBySlug } from "@/lib/books";
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
          width: 1200,
          height: book.cover ? 675 : 630,
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
  if (!book) notFound();
  return (
    <article className="page-shell reader-shell">
      <header className="reader-heading">
        <nav className="reader-breadcrumb" aria-label="パンくず">
          <Link href="/books">ブック</Link>
          <span aria-hidden>/</span>
          <span>{book.category}</span>
        </nav>
        <h1>{book.title}</h1>
        <p className="reader-description">{book.subtitle}</p>
        <div className="reader-meta">
          <span>
            {book.headings.filter((heading) => heading.depth === 2).length}章
          </span>
          <span>{book.readingTimeMinutes}分で読めます</span>
        </div>
        {book.cover ? (
          <div className="reader-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath(book.cover)}
              alt=""
              width={1200}
              height={675}
            />
          </div>
        ) : null}
      </header>
      <div className="reading-layout book-page-layout">
        <div className="min-w-0">
          <BookReader chapters={book.headings} title={book.title}>
            <div className="book-prose prose">
              <MdxContent source={book.content} paginateBook />
            </div>
          </BookReader>
        </div>
        <aside className="book-sidebar">
          <TableOfContents headings={book.headings} />
        </aside>
      </div>
      {book.references.length ? (
        <section className="related-reading">
          <div className="section-heading">
            <h2>関連する記事・資料</h2>
          </div>
          {book.references.map((reference) => (
            <div className="article-row" key={reference.href}>
              <div className="article-row__body">
                <h2>
                  {reference.href.startsWith("http") ? (
                    <a href={reference.href} target="_blank" rel="noreferrer">
                      {reference.title} ↗
                    </a>
                  ) : (
                    <Link href={reference.href}>{reference.title}</Link>
                  )}
                </h2>
                {reference.note ? <p>{reference.note}</p> : null}
              </div>
            </div>
          ))}
        </section>
      ) : null}
    </article>
  );
}
