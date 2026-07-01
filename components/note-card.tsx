import Link from "next/link";
import { CalendarDays, Clock, NotebookPen } from "lucide-react";
import type { Note } from "@/lib/notes";
import { formatDate } from "@/lib/format";
import { slugify } from "@/lib/slug";

const statusLabel: Record<Note["status"], string> = {
  rough: "Rough Note",
  refined: "Refined Note",
};

const sourceLabel: Record<Note["source"], string> = {
  "ai-dialogue": "AI Dialogue",
  manual: "Manual",
  reading: "Reading",
  learning: "Learning",
};

export function NoteCard({ note }: { note: Note }) {
  return (
    <article className="tech-card group flex h-full min-w-0 flex-col rounded-lg border p-5 transition hover:-translate-y-0.5">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
          <NotebookPen aria-hidden size={18} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="rounded-md border border-zinc-200 px-2 py-1 font-medium dark:border-zinc-800">
              {statusLabel[note.status]}
            </span>
            <span className="rounded-md bg-cyan-50 px-2 py-1 font-medium text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              {sourceLabel[note.source]}
            </span>
            <span>{note.area}</span>
          </div>
          <h2 className="mt-2 break-words text-lg font-semibold leading-7 text-zinc-950 dark:text-zinc-50">
            <Link
              href={note.url}
              className="outline-none transition group-hover:text-cyan-700 focus-visible:text-cyan-700 dark:group-hover:text-cyan-300 dark:focus-visible:text-cyan-300"
            >
              {note.title}
            </Link>
          </h2>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 break-words text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {note.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {note.tags.slice(0, 4).map((tag) => (
          <Link
            key={tag}
            href={`/tags/${slugify(tag)}`}
            className="rounded-md border border-zinc-200/80 bg-white/40 px-2 py-1 text-xs text-zinc-600 hover:border-cyan-300 hover:text-zinc-950 dark:border-zinc-800/80 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:border-cyan-700 dark:hover:text-zinc-50"
          >
            #{tag}
          </Link>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-xs text-zinc-500 dark:text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays aria-hidden size={14} />
          {formatDate(note.date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden size={14} />
          {note.readingTimeMinutes} min
        </span>
      </div>
    </article>
  );
}
