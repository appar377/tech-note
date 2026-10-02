import type { Metadata } from "next";
import Link from "next/link";
import { getAllNotes } from "@/lib/notes";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "ノート",
  description: "ひとつの気づきや検討を残した短い読み物。",
};

export default function NotesPage() {
  const notes = getAllNotes();
  return (
    <div className="page-shell narrow-collection">
      <header className="collection-header">
        <h1 className="page-heading">ノート</h1>
        <p className="page-subtitle">ひとつの気づきや検討を、短く読む。</p>
      </header>
      <div className="article-list">
        {notes.map((note) => (
          <article className="article-row" key={note.slug}>
            <div className="article-row__body">
              <div className="article-row__meta">
                <span>{note.area}</span>
                <span>{note.readingTimeMinutes}分</span>
              </div>
              <h2>
                <Link href={note.url}>{note.title}</Link>
              </h2>
              <p>{note.description}</p>
              <time dateTime={note.date}>{formatDate(note.date)}</time>
            </div>
          </article>
        ))}
      </div>
      {notes.length === 0 ? <p>公開ノートはまだありません。</p> : null}
    </div>
  );
}
