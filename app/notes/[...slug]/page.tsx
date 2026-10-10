import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteReader } from "@/components/note-reader";
import { getAllNotes, getNoteBySlug } from "@/lib/notes";
import { absoluteUrl } from "@/lib/site";

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
  if (!note) notFound();
  return (
    <article className="page-shell reader-shell">
      <NoteReader note={note} />
    </article>
  );
}
