import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  GitBranch,
  GraduationCap,
  Layers3,
  NotebookPen,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { getAllArticles, getCategories } from "@/lib/articles";
import { getAllBooks } from "@/lib/books";
import { getAllNotes } from "@/lib/notes";
import { GITHUB_REPO_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Profile",
  description: "Tech Noteを運営するappar377のポートフォリオと公開学習ログ。",
  alternates: {
    canonical: absoluteUrl("/profile"),
  },
};

export default function ProfilePage() {
  const articleCount = getAllArticles().length;
  const bookCount = getAllBooks().length;
  const noteCount = getAllNotes().length;
  const categories = getCategories();

  return (
    <div className="page-shell space-y-10">
      <section className="tech-card rounded-lg border p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex flex-col items-start">
            <div className="grid h-24 w-24 place-items-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
              <UserRound aria-hidden size={42} />
            </div>
            <h1 className="mt-5 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
              appar377
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Backend Engineer / Knowledge Builder
            </p>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-cyan-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-cyan-700 dark:hover:text-zinc-50"
            >
              <GitBranch aria-hidden size={16} />
              GitHub
            </a>
          </div>
          <div className="min-w-0">
            <p className="tech-pill mb-4 gap-2 text-sm">
              <GraduationCap aria-hidden size={15} />
              Portfolio and learning archive
            </p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
              学習・実装・整理の過程を、そのまま公開資産にする。
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400">
              Tech Noteは、技術記事だけでなく、Book、Series、雑記メモ、読書記録まで含めた公開ポートフォリオです。
              ラフな思考をNotesに残し、精査した内容をArticlesへ、さらに目的別にBooksへ育てます。
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric label="Articles" value={articleCount} />
              <Metric label="Books" value={bookCount} />
              <Metric label="Notes" value={noteCount} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">Content Model</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <ContentModelCard
            icon={NotebookPen}
            title="Notes"
            href="/notes"
            description="AI対話や学習中の気づきを、日次の雑記として残す。"
          />
          <ContentModelCard
            icon={FileText}
            title="Articles"
            href="/articles"
            description="単体で読めるように精査した記事として公開する。"
          />
          <ContentModelCard
            icon={BookOpen}
            title="Books"
            href="/books"
            description="1つの目的を達成するために再構成した長編コンテンツ。"
          />
          <ContentModelCard
            icon={Layers3}
            title="Series"
            href="/series"
            description="共通テーマの記事群をまとめて辿れるグループ。"
          />
        </div>
      </section>

      <section>
        <h2 className="section-title">Focus Areas</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="tech-card group rounded-lg border p-4 transition hover:-translate-y-0.5"
            >
              <span className="block font-semibold text-zinc-950 group-hover:text-cyan-700 dark:text-zinc-50 dark:group-hover:text-cyan-300">
                {category.name}
              </span>
              <span className="mt-2 block text-sm text-zinc-500 dark:text-zinc-400">
                {category.count} articles
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white/50 p-4 dark:border-zinc-800 dark:bg-white/[0.03]">
      <span className="block font-mono text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        {value}
      </span>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

function ContentModelCard({
  icon: Icon,
  title,
  href,
  description,
}: {
  icon: LucideIcon;
  title: string;
  href: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="tech-card group flex min-w-0 flex-col rounded-lg border p-5 transition hover:-translate-y-0.5"
    >
      <Icon aria-hidden size={20} className="text-cyan-700 dark:text-cyan-300" />
      <span className="mt-4 flex items-center justify-between gap-3">
        <span className="font-semibold text-zinc-950 dark:text-zinc-50">{title}</span>
        <ArrowRight
          aria-hidden
          size={15}
          className="text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-cyan-700 dark:group-hover:text-cyan-300"
        />
      </span>
      <span className="mt-2 block text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </span>
    </Link>
  );
}
