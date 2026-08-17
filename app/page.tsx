import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronRight,
  FileClock,
  FileText,
  GitBranch,
  GraduationCap,
  Languages,
  Layers3,
  Library,
  NotebookPen,
  PenLine,
  Route,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ArticleThumbnail } from "@/components/article-thumbnail";
import { SearchPanel } from "@/components/search-panel";
import { getAllArticles, getCategories, getSearchIndex, type Article } from "@/lib/articles";
import { getAllBooks, getBookSearchIndex, getFeaturedBooks, type Book } from "@/lib/books";
import { formatDate } from "@/lib/format";
import { getAllNotes, getNoteSearchIndex, type Note } from "@/lib/notes";
import { GITHUB_REPO_URL, withBasePath } from "@/lib/site";

export default function Home() {
  const articles = getAllArticles();
  const books = getAllBooks();
  const allNotes = getAllNotes({ includeDrafts: true });
  const drafts = allNotes.filter((note) => note.draft || note.status === "rough");
  const refinedNotes = allNotes.filter((note) => !note.draft && note.status === "refined");
  const categories = getCategories();
  const latestArticles = articles.slice(0, 6);
  const popularArticles = articles.filter((article) => article.popular);
  const featuredArticle = popularArticles[0] ?? articles[0];
  const featuredArticles = (popularArticles.length > 0 ? popularArticles : articles)
    .filter((article) => article.slug !== featuredArticle?.slug)
    .slice(0, 2);
  const featuredBooks = getFeaturedBooks(3);
  const primaryBook = featuredBooks[0] ?? books[0];
  const primaryDraft = drafts[0];
  const primaryNote = refinedNotes[0] ?? allNotes.find((note) => !note.draft);
  const searchIndex = [...getBookSearchIndex(), ...getSearchIndex(), ...getNoteSearchIndex()];

  return (
    <div className="page-shell home-shell space-y-14">
      <section className="home-hero rounded-2xl border">
        <div className="home-hero__inner grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_420px] lg:p-8">
          <div className="min-w-0">
            <p className="tech-pill mb-5 gap-2 text-sm">
              <Library aria-hidden size={15} />
              Markdown-first public archive
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-6xl">
              学びを、
              <span className="home-hero__accent">途中のまま</span>
              残す。
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              技術記事、ドラフト、ノート、ブック、シリーズを分けて育てる公開ナレッジハブです。
              AIとの対話や日々の気づきはまずドラフトへ、精査した内容は記事へ、目的別に再構成したものはブックへ整理します。
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <HeroChecklist icon={PenLine} title="Markdownで書く" text="思考途中のメモもGitで管理する" />
              <HeroChecklist icon={GitBranch} title="Git pushで公開" text="静的サイトとして自動デプロイする" />
              <HeroChecklist icon={FileClock} title="公開記事と下書きを分離" text="未整理の知見を無理に完成扱いしない" />
              <HeroChecklist icon={BookOpen} title="Books / Notesで体系化" text="まとまった知識は読み物として再編集する" />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/articles" className="home-primary-button">
                記事を読む
                <ArrowRight aria-hidden size={16} />
              </Link>
              <Link href="/drafts" className="home-secondary-button">
                ドラフトを見る
              </Link>
              <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="home-secondary-button">
                <GitBranch aria-hidden size={16} />
                GitHub
              </a>
            </div>
          </div>

          <aside className="grid min-w-0 gap-4">
            <div className="paper-card rounded-xl border p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Content Hub
              </p>
              <h2 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                公開ノート & ポートフォリオ
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                記事、雑記、読書、学習ログを一箇所に集め、後から記事やBookへ育てるための個人ライブラリです。
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <StatCard icon={FileText} label="記事" value={articles.length} />
                <StatCard icon={BookOpen} label="ブック" value={books.length} />
                <StatCard icon={FileClock} label="ドラフト" value={drafts.length} />
                <StatCard icon={NotebookPen} label="ノート" value={refinedNotes.length} />
              </div>
            </div>
            {featuredArticle ? <FeaturedArticleCard article={featuredArticle} primary /> : null}
          </aside>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <SearchPanel index={searchIndex} compact />
        <div className="paper-card flex min-w-0 items-center gap-3 rounded-xl border p-4">
          <Search aria-hidden size={18} className="shrink-0 text-emerald-700 dark:text-emerald-300" />
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            記事・ドラフト・ノート・ブックを横断検索できます。
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="TECH NOTEでできること" href="/profile" linkLabel="設計を見る" />
        <div className="mt-5 grid gap-4 md:grid-cols-5">
          <ContentKindCard
            icon={FileText}
            title="記事"
            href="/articles"
            description="精査済みの知見を、単体で読める公開記事として整理する。"
          />
          <ContentKindCard
            icon={FileClock}
            title="ドラフト"
            href="/drafts"
            description="AI対話や調査メモを、その日の雑記として一旦残す。"
          />
          <ContentKindCard
            icon={NotebookPen}
            title="ノート"
            href="/notes"
            description="読書、学習、実装メモを再利用しやすい形で保存する。"
          />
          <ContentKindCard
            icon={BookOpen}
            title="ブック"
            href="/books"
            description="目的達成に向けて記事群を再構成した長編コンテンツ。"
          />
          <ContentKindCard
            icon={Layers3}
            title="シリーズ"
            href="/series"
            description="拡張子など、共通テーマの記事をグループで辿る。"
          />
        </div>
      </section>

      <section>
        <SectionHeader title="注目の記事" href="/articles" linkLabel="すべての記事を見る" />
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
          {featuredArticle ? <FeaturedArticleCard article={featuredArticle} /> : null}
          <div className="grid gap-4">
            {featuredArticles.map((article) => (
              <FeaturedArticleCard key={article.slug} article={article} compact />
            ))}
            {featuredArticles.length === 0 ? (
              <EmptyPanel
                icon={Sparkles}
                title="注目記事を増やせます"
                description="FrontMatterでpopularを付けると、この枠に優先表示できます。"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.76fr)]">
        <div>
          <SectionHeader title="最新記事" href="/articles" linkLabel="記事一覧" />
          <div className="home-shelf mt-5 rounded-xl border">
            {latestArticles.map((article, index) => (
              <MiniArticleRow key={article.slug} article={article} index={index + 1} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionHeader title="Books / シリーズ" href="/books" linkLabel="ブックを見る" />
            <div className="mt-5 grid gap-4">
              <BookShelfCard book={primaryBook} />
              <ReadingCard
                icon={Route}
                title="シリーズ"
                href="/series"
                description="共通テーマの記事を、順番に辿れるまとまりとして管理します。"
                meta="Extensions / Rails / Flutter"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div>
          <SectionHeader title="ドラフト" href="/drafts" linkLabel="整理中" />
          <div className="paper-card mt-5 rounded-xl border p-5">
            {primaryDraft ? (
              <NotePreviewCard note={primaryDraft} label="AI対話・雑記" />
            ) : (
              <EmptyPanel
                framed={false}
                icon={FileClock}
                title="ドラフトはここに増やします"
                description="AIとの対話、学習中の気づき、記事化前の素材をドラフトとして残します。"
              />
            )}
          </div>
        </div>

        <div>
          <SectionHeader title="ノート" href="/notes" linkLabel="ノート一覧" />
          <div className="paper-card mt-5 rounded-xl border p-5">
            {primaryNote ? (
              <NotePreviewCard note={primaryNote} label="精査済みメモ" />
            ) : (
              <EmptyPanel
                framed={false}
                icon={NotebookPen}
                title="ノートを公開できます"
                description="読み返す価値のある学習メモを、記事より軽い単位で残します。"
              />
            )}
          </div>
        </div>

        <div>
          <SectionHeader title="読書メモ" href="/reading" linkLabel="読書を見る" />
          <div className="paper-card mt-5 rounded-xl border p-5">
            <EmptyPanel
              framed={false}
              icon={BookMarked}
              title="読書記録も公開できます"
              description="技術書、英語、韓国語、設計、思考法などを読みっぱなしにせず、記事やBookにつながるメモとして残します。"
            />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="専門領域" href="/categories" linkLabel="カテゴリ" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.slice(0, 8).map((category) => (
            <AreaCard
              key={category.slug}
              title={category.name}
              href={`/categories/${category.slug}`}
              description={`${category.count}件の記事`}
              icon={Boxes}
            />
          ))}
          <AreaCard title="Language Learning" description="英語・韓国語の学習記録" icon={Languages} />
          <AreaCard title="Learning Tips" description="学習法や整理のコツ" icon={GraduationCap} />
        </div>
      </section>
    </div>
  );
}

function HeroChecklist({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="home-check-item rounded-xl border p-4">
      <Icon aria-hidden size={18} />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-zinc-600 dark:text-zinc-400">{text}</span>
      </span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-zinc-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <Icon aria-hidden size={16} className="text-emerald-700 dark:text-emerald-300" />
      <span className="mt-2 block text-xl font-semibold text-zinc-950 dark:text-zinc-50">{value}</span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

function ContentKindCard({
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
    <Link href={href} className="content-kind-card group rounded-xl border p-5">
      <span className="content-kind-card__icon">
        <Icon aria-hidden size={20} />
      </span>
      <span className="mt-5 flex items-center justify-between gap-3">
        <span className="font-semibold text-zinc-950 dark:text-zinc-50">{title}</span>
        <ChevronRight
          aria-hidden
          size={16}
          className="text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-300"
        />
      </span>
      <span className="mt-2 block text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</span>
    </Link>
  );
}

function FeaturedArticleCard({
  article,
  compact = false,
  primary = false,
}: {
  article: Article;
  compact?: boolean;
  primary?: boolean;
}) {
  return (
    <article className={`paper-card group overflow-hidden rounded-xl border ${compact ? "grid grid-cols-[120px_minmax(0,1fr)]" : ""}`}>
      {article.thumbnail ? (
        <Link href={article.url} aria-label={`${article.title}を読む`} className="block">
          <ArticleThumbnail article={article} priority={primary} framed={false} />
        </Link>
      ) : null}
      <div className={compact ? "min-w-0 p-4" : "p-5"}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            {article.category}
          </span>
          {article.series ? <span>{article.series.name}</span> : null}
        </div>
        <h3 className={`${compact ? "mt-2 text-sm leading-6" : "mt-3 text-xl leading-8"} break-words font-semibold text-zinc-950 dark:text-zinc-50`}>
          <Link href={article.url} className="transition group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
            {article.title}
          </Link>
        </h3>
        {!compact ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {article.description}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{formatDate(article.date)}</span>
          <span>{article.readingTimeMinutes} min</span>
        </div>
      </div>
    </article>
  );
}

function MiniArticleRow({ article, index }: { article: Article; index: number }) {
  return (
    <Link href={article.url} className="group grid gap-4 p-4 transition hover:bg-emerald-500/[0.08] sm:grid-cols-[2rem_minmax(0,1fr)_auto]">
      <span className="font-mono text-sm text-emerald-700 dark:text-emerald-300">{String(index).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="block break-words font-semibold text-zinc-950 group-hover:text-emerald-700 dark:text-zinc-50 dark:group-hover:text-emerald-300">
          {article.title}
        </span>
        <span className="mt-1 line-clamp-1 block text-sm text-zinc-500 dark:text-zinc-400">
          {article.description}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{formatDate(article.date)}</span>
        <span>{article.readingTimeMinutes}分</span>
      </span>
    </Link>
  );
}

function BookShelfCard({ book }: { book?: Book }) {
  if (!book) {
    return (
      <EmptyPanel
        icon={BookOpen}
        title="Bookを追加できます"
        description="記事を寄せ集めるだけでなく、ひとつの目的を達成する読み物として再構成します。"
      />
    );
  }

  return (
    <Link href={book.url} className="paper-card group grid gap-4 overflow-hidden rounded-xl border p-4 sm:grid-cols-[136px_minmax(0,1fr)]">
      {book.cover ? (
        <span className="tech-thumbnail block aspect-[4/5] overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBasePath(book.cover)} alt={`${book.title} cover`} width={960} height={1200} className="h-full w-full object-cover" />
        </span>
      ) : (
        <span className="grid aspect-[4/5] place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
          <BookOpen aria-hidden size={34} />
        </span>
      )}
      <span className="min-w-0 py-1">
        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Book</span>
        <span className="mt-1 block break-words text-lg font-semibold text-zinc-950 group-hover:text-emerald-700 dark:text-zinc-50 dark:group-hover:text-emerald-300">
          {book.title}
        </span>
        <span className="mt-2 block text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">
          {book.subtitle}
        </span>
        <span className="mt-3 line-clamp-3 block text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {book.description}
        </span>
      </span>
    </Link>
  );
}

function ReadingCard({
  icon: Icon,
  title,
  href,
  description,
  meta,
}: {
  icon: LucideIcon;
  title: string;
  href: string;
  description: string;
  meta: string;
}) {
  return (
    <Link href={href} className="paper-card group rounded-xl border p-5">
      <Icon aria-hidden size={20} className="text-emerald-700 dark:text-emerald-300" />
      <span className="mt-4 block font-semibold text-zinc-950 group-hover:text-emerald-700 dark:text-zinc-50 dark:group-hover:text-emerald-300">
        {title}
      </span>
      <span className="mt-2 block text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</span>
      <span className="mt-4 block text-xs text-zinc-500 dark:text-zinc-500">{meta}</span>
    </Link>
  );
}

function NotePreviewCard({ note, label }: { note: Note; label: string }) {
  const body = (
    <>
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
        {label}
      </span>
      <span className="mt-3 block text-sm font-semibold text-zinc-950 dark:text-zinc-50">{note.title}</span>
      <span className="mt-2 line-clamp-3 block text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {note.description}
      </span>
      <span className="mt-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
        <CheckCircle2 aria-hidden size={14} />
        {formatDate(note.date)}
      </span>
    </>
  );

  if (note.draft) {
    return <div>{body}</div>;
  }

  return <Link href={note.url} className="group block transition hover:text-emerald-700">{body}</Link>;
}

function EmptyPanel({
  icon: Icon,
  title,
  description,
  framed = true,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  framed?: boolean;
}) {
  return (
    <div className={framed ? "paper-card rounded-xl border p-5" : ""}>
      <Icon aria-hidden size={22} className="text-emerald-700 dark:text-emerald-300" />
      <h3 className="mt-4 font-semibold text-zinc-950 dark:text-zinc-50">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}

function AreaCard({
  title,
  href,
  description,
  icon: Icon,
}: {
  title: string;
  href?: string;
  description: string;
  icon: LucideIcon;
}) {
  const body = (
    <>
      <Icon aria-hidden size={18} className="text-emerald-700 dark:text-emerald-300" />
      <span className="mt-4 block min-w-0 truncate font-semibold text-zinc-950 dark:text-zinc-50">{title}</span>
      <span className="mt-2 block text-sm text-zinc-500 dark:text-zinc-400">{description}</span>
    </>
  );

  if (!href) {
    return <div className="paper-card rounded-xl border p-4">{body}</div>;
  }

  return (
    <Link href={href} className="paper-card group rounded-xl border p-4 transition hover:-translate-y-0.5">
      {body}
    </Link>
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
