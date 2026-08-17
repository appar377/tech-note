import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, FileClock, Sparkles, Tags } from "lucide-react";
import { formatDate } from "@/lib/format";
import { getAllNotes, type Note } from "@/lib/notes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "ドラフト",
  description: "AI対話や日々の気づきを、公開記事へ育てる前の素材として管理するドラフト一覧。",
  alternates: {
    canonical: absoluteUrl("/drafts"),
  },
};

const sourceLabels: Record<Note["source"], string> = {
  "ai-dialogue": "AI対話メモ",
  manual: "手動メモ",
  reading: "読書メモ",
  learning: "学習メモ",
};

export default function DraftsPage() {
  const drafts = getAllNotes({ includeDrafts: true }).filter(
    (note) => note.draft || note.status === "rough",
  );

  return (
    <div className="page-shell">
      <header className="mb-10">
        <p className="tech-pill mb-3 gap-2 text-sm">
          <FileClock aria-hidden size={15} />
          Drafts
        </p>
        <h1 className="page-heading">ドラフト</h1>
        <p className="page-subtitle">
          AIとの対話、日々の気づき、記事化前の素材を一時的に置く場所です。
          ここで集めた断片を精査し、公開記事やブックへ育てます。
        </p>
      </header>

      {drafts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {drafts.map((note) => (
            <DraftCard key={note.slug} note={note} />
          ))}
        </div>
      ) : (
        <div className="tech-card rounded-lg border p-8">
          <FileClock aria-hidden size={24} className="text-cyan-700 dark:text-cyan-300" />
          <h2 className="mt-4 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            まだドラフトはありません
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            AI対話や学習中のメモを、記事化前の素材としてここに蓄積します。
          </p>
        </div>
      )}
    </div>
  );
}

function DraftCard({ note }: { note: Note }) {
  const cardContent = (
    <>
      <span className="flex items-center gap-2 text-xs font-medium text-cyan-700 dark:text-cyan-300">
        <Sparkles aria-hidden size={14} />
        {sourceLabels[note.source]}
      </span>
      <span className="mt-3 block break-words text-lg font-semibold leading-7 text-zinc-950 dark:text-zinc-50">
        {note.title}
      </span>
      <span className="mt-2 line-clamp-2 block break-words text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {note.description}
      </span>
      <span className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500">
        <span className="inline-flex items-center gap-1">
          <CalendarDays aria-hidden size={14} />
          {formatDate(note.date)}
        </span>
        {note.tags.length > 0 ? (
          <span className="inline-flex items-center gap-1">
            <Tags aria-hidden size={14} />
            {note.tags.slice(0, 3).join(" / ")}
          </span>
        ) : null}
      </span>
    </>
  );
  const className =
    "tech-card block min-w-0 rounded-lg border p-5 transition hover:-translate-y-0.5";

  if (note.draft) {
    return <div className={className}>{cardContent}</div>;
  }

  return (
    <Link href={note.url} className={className}>
      {cardContent}
    </Link>
  );
}
