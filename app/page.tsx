import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Boxes,
  FileText,
  GitBranch,
  GraduationCap,
  Hash,
  Languages,
  Layers3,
  Library,
  NotebookPen,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { BookCard } from "@/components/book-card";
import { SearchPanel } from "@/components/search-panel";
import { getAllArticles, getCategories, getSearchIndex, getTags } from "@/lib/articles";
import { getAllBooks, getBookSearchIndex, getFeaturedBooks } from "@/lib/books";
import { formatDate } from "@/lib/format";
import { getAllNotes, getNoteSearchIndex } from "@/lib/notes";
import { GITHUB_REPO_URL } from "@/lib/site";

export default function Home() {
  const articles = getAllArticles();
  const books = getAllBooks();
  const notes = getAllNotes();
  const categories = getCategories();
  const tags = getTags();
  const latestArticles = articles.slice(0, 5);
  const featuredBooks = getFeaturedBooks(2);
  const featuredArticles = articles.filter((article) => article.popular).slice(0, 3);
  const featured = featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 3);
  const searchIndex = [...getBookSearchIndex(), ...getSearchIndex(), ...getNoteSearchIndex()];

  return (
    <div className="page-shell space-y-12">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="tech-card rounded-lg border p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[160px_minmax(0,1fr)]">
            <div>
              <div className="grid h-24 w-24 place-items-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                <UserRound aria-hidden size={42} />
              </div>
              <h1 className="mt-5 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                Tech Note
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Portfolio & Learning Library
              </p>
            </div>
            <div className="min-w-0">
              <p className="tech-pill mb-4 gap-2 text-sm">
                <Library aria-hidden size={15} />
                appar377 public knowledge hub
              </p>
              <h2 className="max-w-3xl break-words text-3xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
                学習と実装の過程を、公開できる知識資産へ育てる。
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400">
                技術記事、Book、Series、雑記メモ、読書記録をひとつにまとめたポートフォリオです。
                AIとの対話や日々の気づきはNotesへ、精査した内容はArticlesへ、目的別に磨いた長編はBooksへ整理します。
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Rails", "RSpec", "SQL", "Database", "Git", "Learning"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-zinc-200 bg-white/50 px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-white/[0.03] dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Articlesを読む
                  <ArrowRight aria-hidden size={15} />
                </Link>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-cyan-300 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-cyan-700 dark:hover:text-zinc-50"
                >
                  <GitBranch aria-hidden size={16} />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SearchPanel index={searchIndex} compact />
          <div className="grid grid-cols-2 gap-3">
            <Metric icon={FileText} label="Articles" value={articles.length} />
            <Metric icon={BookOpen} label="Books" value={books.length} />
            <Metric icon={NotebookPen} label="Notes" value={notes.length} />
            <Metric icon={Hash} label="Tags" value={tags.length} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Content Flow" href="/profile" linkLabel="View profile" />
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <FlowCard
            icon={NotebookPen}
            title="Notes"
            href="/notes"
            description="AI対話や日々の気づきを、その日の雑記として残す。"
          />
          <FlowCard
            icon={FileText}
            title="Articles"
            href="/articles"
            description="メモを精査し、単体で読める公開記事に整える。"
          />
          <FlowCard
            icon={BookOpen}
            title="Books"
            href="/books"
            description="目的達成に向けて記事群を再構成した長編コンテンツ。"
          />
          <FlowCard
            icon={Layers3}
            title="Series"
            href="/series"
            description="拡張子など、共通テーマの記事をグループで辿る。"
          />
        </div>
      </section>

      <section>
        <SectionHeader title="Featured Articles" href="/articles" linkLabel="All articles" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {featured.map((article) => (
            <ArticleCard key={article.slug} article={article} compact />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
        <div>
          <SectionHeader title="Latest Articles" href="/articles" linkLabel="View all" />
          <div className="tech-card mt-5 divide-y divide-zinc-100 rounded-lg border dark:divide-zinc-900/80">
            {latestArticles.map((article) => (
              <Link
                key={article.slug}
                href={article.url}
                className="group flex min-w-0 gap-4 p-4 transition hover:bg-cyan-500/10"
              >
                <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                  <FileText aria-hidden size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block break-words font-semibold text-zinc-950 group-hover:text-cyan-700 dark:text-zinc-50 dark:group-hover:text-cyan-300">
                    {article.title}
                  </span>
                  <span className="mt-1 line-clamp-1 block text-sm text-zinc-500 dark:text-zinc-400">
                    {article.description}
                  </span>
                  <span className="mt-2 block text-xs text-zinc-500 dark:text-zinc-500">
                    {formatDate(article.date)} ・ {article.readingTimeMinutes} min
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionHeader title="Books" href="/books" linkLabel="All books" />
            <div className="mt-5 grid gap-4">
              {featuredBooks.map((book) => (
                <BookCard key={book.slug} book={book} compact />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeader title="Notes" href="/notes" linkLabel="Open notes" />
          <div className="tech-card mt-5 rounded-lg border p-5">
            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.slice(0, 3).map((note) => (
                  <Link
                    key={note.slug}
                    href={note.url}
                    className="block rounded-lg border border-zinc-200 p-4 transition hover:border-cyan-300 dark:border-zinc-800 dark:hover:border-cyan-700"
                  >
                    <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {note.title}
                    </span>
                    <span className="mt-1 line-clamp-1 block text-xs text-zinc-500 dark:text-zinc-400">
                      {note.description}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyPanel
                icon={NotebookPen}
                title="雑記メモはここに増やします"
                description="AIとの対話、学習中の気づき、記事化前の素材をNotesとして残します。"
              />
            )}
          </div>
        </div>

        <div>
          <SectionHeader title="Reading" href="/reading" linkLabel="Open reading" />
          <div className="tech-card mt-5 rounded-lg border p-5">
            <EmptyPanel
              icon={BookMarked}
              title="読書記録も公開できます"
              description="技術書、英語、韓国語、設計、思考法などを読みっぱなしにせず、記事やBookにつながるメモとして残します。"
            />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Focus Areas" href="/categories" linkLabel="Categories" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="tech-card group rounded-lg border p-4 transition hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate font-semibold text-zinc-950 group-hover:text-cyan-700 dark:text-zinc-50 dark:group-hover:text-cyan-300">
                  {category.name}
                </span>
                <Boxes aria-hidden size={16} className="shrink-0 text-zinc-400" />
              </span>
              <span className="mt-2 block text-sm text-zinc-500 dark:text-zinc-400">
                {category.count} articles
              </span>
            </Link>
          ))}
          <div className="tech-card rounded-lg border p-4">
            <Languages aria-hidden size={18} className="text-cyan-700 dark:text-cyan-300" />
            <span className="mt-3 block font-semibold text-zinc-950 dark:text-zinc-50">
              Languages
            </span>
            <span className="mt-2 block text-sm text-zinc-500 dark:text-zinc-400">
              英語・韓国語の学習記録も今後追加
            </span>
          </div>
          <div className="tech-card rounded-lg border p-4">
            <GraduationCap aria-hidden size={18} className="text-cyan-700 dark:text-cyan-300" />
            <span className="mt-3 block font-semibold text-zinc-950 dark:text-zinc-50">
              Learning Tips
            </span>
            <span className="mt-2 block text-sm text-zinc-500 dark:text-zinc-400">
              勉強法や整理のコツも蓄積
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="tech-card rounded-lg border p-4">
      <Icon aria-hidden size={18} className="text-cyan-700 dark:text-cyan-300" />
      <span className="mt-3 block text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        {value}
      </span>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

function FlowCard({
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

function EmptyPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div>
      <Icon aria-hidden size={22} className="text-cyan-700 dark:text-cyan-300" />
      <h3 className="mt-4 font-semibold text-zinc-950 dark:text-zinc-50">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="section-title">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        {linkLabel}
        <ArrowRight aria-hidden size={15} />
      </Link>
    </div>
  );
}
