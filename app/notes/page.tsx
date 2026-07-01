import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  NotebookPen,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { getAllNotes } from "@/lib/notes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Notes",
  description: "AIとの対話や日々の学習から生まれたラフな公開メモ。",
  alternates: {
    canonical: absoluteUrl("/notes"),
  },
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <div className="page-shell space-y-10">
      <header>
        <p className="tech-pill mb-4 gap-2 text-sm">
          <NotebookPen aria-hidden size={15} />
          Daily knowledge log
        </p>
        <h1 className="page-heading">Notes</h1>
        <p className="page-subtitle">
          AIとの対話、調査メモ、学習中の気づきをその日の雑記として公開管理する場所です。
          ここで育った内容を、あとからArticlesやBooksへ再構成します。
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <WorkflowCard
          icon={NotebookPen}
          title="Notes"
          description="思いつきや対話内容を、粗くても失わないための公開メモ。"
        />
        <WorkflowCard
          icon={FileText}
          title="Articles"
          description="メモを精査し、単体で読める技術記事や学習記事へ整える。"
        />
        <WorkflowCard
          icon={BookOpen}
          title="Books"
          description="複数の記事を目的別に再構成し、1冊で理解できる形に磨く。"
        />
      </section>

      {notes.length > 0 ? (
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">Public Notes</h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{notes.length} notes</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {notes.map((note) => (
              <NoteCard key={note.slug} note={note} />
            ))}
          </div>
        </section>
      ) : (
        <section className="tech-card rounded-lg border p-8">
          <div className="max-w-2xl">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              <PenLine aria-hidden size={22} />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
              まだ公開メモはありません
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              `notes/` 配下にMDXを追加すると、このページに日次メモとして表示されます。
              ラフな内容はNotesに残し、読み物として整えたものはArticlesへ移す運用です。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Articlesを見る
                <ArrowRight aria-hidden size={15} />
              </Link>
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-cyan-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-cyan-700 dark:hover:text-zinc-50"
              >
                Booksを見る
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function WorkflowCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="tech-card rounded-lg border p-5">
      <Icon aria-hidden size={20} className="text-cyan-700 dark:text-cyan-300" />
      <h2 className="mt-4 font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}
