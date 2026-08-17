import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  FileText,
  GitBranch,
  Layers3,
  Network,
  NotebookPen,
  Search,
  Tags,
} from "lucide-react";
import { SearchPanel } from "@/components/search-panel";
import {
  getAllArticles,
  getCategories,
  getSearchIndex,
  getSeries,
  getTags,
} from "@/lib/articles";
import { getAllBooks, getBookSearchIndex } from "@/lib/books";
import { formatDate } from "@/lib/format";
import { getAllNotes, getNoteSearchIndex } from "@/lib/notes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Search",
  description: "Tech NoteのArticles、Books、Notesをタイトル、本文、タグ、カテゴリから検索。",
  alternates: {
    canonical: absoluteUrl("/search"),
  },
};

const connectionGroups = [
  {
    label: "Rails",
    nodes: ["ActiveRecord", "Dirty Tracking", "Transaction", "RSpec"],
  },
  {
    label: "Flutter",
    nodes: ["Dio", "Secure Storage", "Riverpod", "GoRouter"],
  },
  {
    label: "Database",
    nodes: ["SQL", "EXPLAIN", "Optimizer", "Lock"],
  },
];

export default function SearchPage() {
  const articleIndex = getSearchIndex();
  const bookIndex = getBookSearchIndex();
  const noteIndex = getNoteSearchIndex();
  const index = [...bookIndex, ...articleIndex, ...noteIndex];
  const articles = getAllArticles().slice(0, 6);
  const books = getAllBooks().slice(0, 3);
  const notes = getAllNotes().slice(0, 4);
  const categories = getCategories().slice(0, 8);
  const tags = getTags().slice(0, 12);
  const series = getSeries().slice(0, 4);

  return (
    <div className="page-shell">
      <header className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <div>
          <p className="tech-pill mb-3 gap-2 text-sm">
            <Search aria-hidden size={15} />
            Search Hub
          </p>
          <h1 className="page-heading">知識を横断検索する</h1>
          <p className="page-subtitle">
            公開記事、整理済みのBook、日々のNoteをまとめて探します。思いつきの記録から、ブラッシュアップ済みの記事、目的別に再構成した本まで同じ入口から辿れます。
          </p>
        </div>
        <div className="tech-card rounded-xl border p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Search Scope
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <ScopeStat icon={<FileText aria-hidden size={16} />} label="Articles" value={articleIndex.length} />
            <ScopeStat icon={<BookOpen aria-hidden size={16} />} label="Books" value={bookIndex.length} />
            <ScopeStat icon={<NotebookPen aria-hidden size={16} />} label="Notes" value={noteIndex.length} />
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="space-y-4">
          <FilterPanel
            title="Content"
            icon={<Layers3 aria-hidden size={16} />}
            items={[
              { label: "公開記事", count: articleIndex.length, href: "/articles" },
              { label: "Books", count: bookIndex.length, href: "/books" },
              { label: "Notes", count: noteIndex.length, href: "/notes" },
              { label: "下書き", count: getAllNotes({ includeDrafts: true }).filter((note) => note.draft).length, href: "/drafts" },
            ]}
          />
          <FilterPanel
            title="Categories"
            icon={<GitBranch aria-hidden size={16} />}
            items={categories.map((category) => ({
              label: category.name,
              count: category.count,
              href: `/categories/${category.slug}`,
            }))}
          />
          <div className="tech-card rounded-xl border p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              <Tags aria-hidden size={15} />
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="rounded-md border border-zinc-200 bg-white/70 px-2.5 py-1 text-xs text-zinc-600 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-cyan-400/50 dark:hover:text-cyan-200"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <section className="tech-card rounded-xl border p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  横断検索
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  タイトル、本文、タグ、カテゴリ、Book/Noteの本文まで対象にします。
                </p>
              </div>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-300">
                incremental
              </span>
            </div>
            <SearchPanel index={index} />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <ResultGroup
              title="Books"
              description="記事を目的別に再構成した、技術書のような読み物。"
              entries={books.map((book) => ({
                title: book.title,
                description: book.description,
                href: book.url,
                meta: `${book.category} / ${book.readingTimeMinutes} min`,
              }))}
            />
            <ResultGroup
              title="Notes"
              description="AI対話や日々の学習を、公開メモとして残したもの。"
              entries={notes.map((note) => ({
                title: note.title,
                description: note.description,
                href: note.url,
                meta: `${note.area} / ${formatDate(note.date)}`,
              }))}
            />
          </section>

          <section className="tech-card rounded-xl border p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  最近の公開記事
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  検索前に、最新のまとまった記事から入ることもできます。
                </p>
              </div>
              <Link href="/articles" className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                すべて見る
              </Link>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-white/10">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={article.url}
                  className="grid gap-2 py-3 transition hover:text-cyan-700 sm:grid-cols-[1fr_auto] dark:hover:text-cyan-300"
                >
                  <span className="min-w-0">
                    <span className="block break-words text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {article.title}
                    </span>
                    <span className="mt-1 line-clamp-1 block text-xs text-zinc-500 dark:text-zinc-400">
                      {article.description}
                    </span>
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-500">
                    {formatDate(article.date)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-4">
          <div className="tech-card rounded-xl border p-4">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              <Network aria-hidden size={15} />
              知識のつながり
            </p>
            <div className="space-y-3">
              {connectionGroups.map((group) => (
                <div key={group.label} className="rounded-lg border border-zinc-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{group.label}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {group.nodes.map((node) => (
                      <span
                        key={node}
                        className="rounded-md bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-700 dark:text-cyan-300"
                      >
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tech-card rounded-xl border p-4">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              <Layers3 aria-hidden size={15} />
              Series
            </p>
            <div className="space-y-3">
              {series.map((item) => (
                <Link
                  key={item.slug}
                  href={`/series/${item.slug}`}
                  className="block rounded-lg border border-zinc-200 bg-white/60 p-3 transition hover:border-cyan-300 hover:bg-cyan-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-400/50"
                >
                  <span className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {item.name}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    {item.goal}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ScopeStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
        {icon}
      </span>
      <span className="mt-2 block font-mono text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        {value}
      </span>
      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

function FilterPanel({
  title,
  icon,
  items,
}: {
  title: string;
  icon: ReactNode;
  items: { label: string; count: number; href: string }[];
}) {
  return (
    <div className="tech-card rounded-xl border p-4">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        {icon}
        {title}
      </p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition hover:bg-cyan-500/10"
          >
            <span className="truncate text-zinc-700 dark:text-zinc-300">{item.label}</span>
            <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">{item.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ResultGroup({
  title,
  description,
  entries,
}: {
  title: string;
  description: string;
  entries: { title: string; description: string; href: string; meta: string }[];
}) {
  return (
    <div className="tech-card rounded-xl border p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
      <div className="mt-4 space-y-3">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="block rounded-lg border border-zinc-200 bg-white/60 p-3 transition hover:border-cyan-300 hover:bg-cyan-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-400/50"
          >
            <span className="block break-words text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              {entry.title}
            </span>
            <span className="mt-1 line-clamp-2 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {entry.description}
            </span>
            <span className="mt-2 block text-[11px] text-zinc-400 dark:text-zinc-500">
              {entry.meta}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
