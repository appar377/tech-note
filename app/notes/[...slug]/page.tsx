import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, NotebookPen } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/toc";
import { formatDate } from "@/lib/format";
import { getAllNotes, getNoteBySlug } from "@/lib/notes";
import { absoluteUrl } from "@/lib/site";
import { slugify } from "@/lib/slug";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllNotes().map((note) => ({
    slug: note.slugSegments,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    return {};
  }

  const socialImage = note.thumbnail
    ? {
        url: absoluteUrl(note.thumbnail),
        width: 1200,
        height: 675,
        alt: note.title,
      }
    : {
        url: absoluteUrl("/tech-note-mark.svg"),
        width: 1200,
        height: 630,
        alt: note.title,
      };

  return {
    title: note.title,
    description: note.description,
    alternates: {
      canonical: note.canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: note.canonicalUrl,
      title: note.title,
      description: note.description,
      publishedTime: note.date,
      modifiedTime: note.updated ?? note.date,
      tags: note.tags,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.description,
      images: [socialImage.url],
    },
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <article className="page-shell">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Notes", href: "/notes" },
          { label: note.area },
        ]}
      />

      <header className="mt-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <p className="tech-pill mb-4 gap-2 text-sm">
          <NotebookPen aria-hidden size={15} />
          {note.status === "rough" ? "Rough Note" : "Refined Note"}
        </p>
        <h1 className="max-w-4xl break-words text-3xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          {note.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg">
          {note.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden size={16} />
            {formatDate(note.date)}
          </span>
          {note.updated ? <span>Updated {formatDate(note.updated)}</span> : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden size={16} />
            {note.readingTimeMinutes} min read
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-lg bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
            {note.area}
          </span>
          {note.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${slugify(tag)}`}
              className="rounded-lg border border-zinc-200 bg-white/40 px-3 py-1.5 text-sm text-zinc-600 hover:border-cyan-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:border-cyan-700 dark:hover:text-zinc-50"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="prose min-w-0 max-w-none">
          <MdxContent source={note.content} />
        </div>
        {note.headings.length > 0 ? (
          <aside className="order-first lg:sticky lg:top-24 lg:order-none lg:self-start">
            <TableOfContents headings={note.headings} />
          </aside>
        ) : null}
      </div>
    </article>
  );
}
