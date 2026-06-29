import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Check, Square } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatArticleLevel, formatArticleType } from "@/lib/article-metadata";
import { getArticlesBySeries, getSeries } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getSeries().map((series) => ({
    slug: series.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeries().find((item) => item.slug === slug);

  if (!series) return {};

  return {
    title: series.name,
    description: series.description,
    alternates: {
      canonical: absoluteUrl(`/series/${series.slug}`),
    },
  };
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const series = getSeries().find((item) => item.slug === slug);
  const articles = getArticlesBySeries(slug);

  if (!series) {
    notFound();
  }

  const sections = series.sections.reduce<Array<{
    title: string;
    description: string;
    articles: Array<{
      article: (typeof articles)[number];
      chapterNumber: number;
    }>;
  }>>((builtSections, section) => {
    const chapterOffset = builtSections.reduce(
      (total, builtSection) => total + builtSection.articles.length,
      0,
    );

    return [
      ...builtSections,
      {
        ...section,
        articles: section.articles.map((article, index) => ({
          article,
          chapterNumber: chapterOffset + index + 1,
        })),
      },
    ];
  }, []);
  const totalReadingTime = articles.reduce(
    (total, article) => total + article.readingTimeMinutes,
    0,
  );

  return (
    <div className="page-shell">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Series", href: "/series" }, { label: series.name }]} />
      <header className="mb-10 mt-8">
        <p className="tech-pill mb-3 gap-2 text-sm">
          <BookOpen aria-hidden size={15} />
          {series.category} Book Series
        </p>
        <h1 className="page-heading">{series.name}</h1>
        <p className="mt-4 max-w-3xl break-words text-xl font-medium leading-8 text-zinc-800 dark:text-zinc-200">
          {series.subtitle}
        </p>
        <p className="page-subtitle mt-4">{series.description}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <SeriesMetric label="Published chapters" value={`${series.count}`} />
          <SeriesMetric label="Reading time" value={`${totalReadingTime} min`} />
          <SeriesMetric label="Sections" value={`${series.sections.length}`} />
        </div>
      </header>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-12">
          <section>
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              Mastery Goal
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              このシリーズでマスターすること
            </h2>
            <p className="mt-4 break-words text-base leading-8 text-zinc-600 dark:text-zinc-400">
              {series.goal}
            </p>
            {series.outcomes.length > 0 ? (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {series.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="tech-shell flex min-w-0 items-start gap-3 rounded-lg border p-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300"
                  >
                    <Check
                      aria-hidden
                      size={16}
                      className="mt-1 shrink-0 text-emerald-600 dark:text-emerald-300"
                    />
                    <span className="min-w-0 break-words">{outcome}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          {series.concept ? (
            <section>
              <p className="text-sm font-medium uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                Concept Map
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                全体像
              </h2>
              <p className="tech-shell mt-4 break-words rounded-lg border p-5 text-base leading-8 text-zinc-700 dark:text-zinc-300">
                {series.concept}
              </p>
            </section>
          ) : null}

          <section>
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              Table of Contents
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              章立て
            </h2>
            <div className="mt-6 space-y-9">
              {sections.map((section) => (
                <section key={section.title}>
                  <h3 className="break-words text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    {section.title}
                  </h3>
                  <p className="mt-2 break-words text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {section.description}
                  </p>
                  <ol className="mt-4 space-y-3">
                    {section.articles.map(({ article, chapterNumber: currentChapter }) => (
                      <li
                        key={article.slug}
                        className="tech-card rounded-lg border p-5 transition hover:-translate-y-0.5"
                      >
                        <Link
                          href={article.url}
                          className="grid min-w-0 gap-4 sm:grid-cols-[88px_1fr]"
                        >
                          <span className="flex items-center gap-3">
                            <Square aria-hidden size={18} className="text-zinc-400" />
                            <span className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-500/10 font-mono text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                              {String(currentChapter).padStart(2, "0")}
                            </span>
                          </span>
                          <span className="min-w-0">
                            <span className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                              <span className="rounded-md border border-zinc-200 px-2 py-1 font-mono text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                                {formatArticleLevel(article.level)}
                              </span>
                              <span className="rounded-md border border-zinc-200 px-2 py-1 font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                                {formatArticleType(article.articleType)}
                              </span>
                            </span>
                            <span className="block break-words text-lg font-semibold leading-7 text-zinc-950 dark:text-zinc-50">
                              {article.title}
                            </span>
                            <span className="mt-1 block break-words text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                              {article.description}
                            </span>
                            <span className="mt-3 block text-xs text-zinc-500 dark:text-zinc-500">
                              {formatDate(article.date)} / {article.readingTimeMinutes} min
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </section>

          {series.notes.length > 0 ? (
            <section>
              <p className="text-sm font-medium uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                Series Notes
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                補足解説
              </h2>
              <div className="mt-5 space-y-4">
                {series.notes.map((note) => (
                  <article key={note.title} className="border-l-2 border-emerald-400 pl-4">
                    <h3 className="break-words text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      {note.title}
                    </h3>
                    <p className="mt-2 break-words text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                      {note.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </main>

        <aside className="min-w-0 space-y-8 lg:sticky lg:top-24 lg:self-start">
          {series.audience.length > 0 ? (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                対象読者
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {series.audience.map((item) => (
                  <li key={item} className="break-words">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {series.prerequisites.length > 0 ? (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                前提知識
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {series.prerequisites.map((item) => (
                  <li key={item} className="break-words">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {series.references.length > 0 ? (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                参考
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {series.references.map((reference) => (
                  <li key={reference.title} className="break-words">
                    {reference.href ? (
                      <a
                        href={reference.href}
                        className="text-cyan-700 underline decoration-cyan-200 underline-offset-4 hover:text-cyan-800 dark:text-cyan-300 dark:decoration-cyan-900 dark:hover:text-cyan-200"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {reference.title}
                      </a>
                    ) : (
                      reference.title
                    )}
                    {reference.note ? (
                      <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-500">
                        {reference.note}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function SeriesMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="tech-card rounded-lg border p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
        {label}
      </p>
      <p className="mt-1 break-words font-mono text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}
