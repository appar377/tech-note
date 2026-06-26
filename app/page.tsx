import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Hash,
  Layers3,
  Library,
  type LucideIcon,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { LogoMark } from "@/components/logo";
import { SearchPanel } from "@/components/search-panel";
import { TaxonomyList } from "@/components/taxonomy-list";
import { getAllArticles, getCategories, getSearchIndex, getSeries, getTags } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles();
  const categories = getCategories();
  const tags = getTags();
  const series = getSeries();
  const latestArticles = articles.slice(0, 4);
  const featuredArticles = articles.filter((article) => article.popular).slice(0, 3);
  const featured = featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 3);

  return (
    <div className="page-shell space-y-16">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:items-center">
        <div className="min-w-0">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <Library aria-hidden size={15} />
            Personal technology library
          </p>
          <div className="mb-5 flex items-center gap-4">
            <LogoMark className="h-14 w-14" />
            <div className="min-w-0">
              <h1 className="truncate text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
                Tech Note
              </h1>
              <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Single Source of Truth
              </p>
            </div>
          </div>
          <h2 className="max-w-3xl break-words text-3xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
            <span className="block sm:inline">技術知識を、</span>
            <span className="block sm:inline">探せる形で残す。</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg">
            <span className="block">Markdownを書くだけで公開される、</span>
            <span className="block">個人の技術ブログ兼ナレッジベース。</span>
            <span className="block">記事・カテゴリ・タグ・シリーズから、</span>
            <span className="block">必要な知識へすばやく戻れる場所です。</span>
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Metric icon={BookOpen} label="Articles" value={articles.length} />
            <Metric icon={Boxes} label="Categories" value={categories.length} />
            <Metric icon={Hash} label="Tags" value={tags.length} />
          </div>
        </div>
        <div className="min-w-0 space-y-4">
          <SearchPanel index={getSearchIndex()} compact />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold text-zinc-950 dark:text-zinc-50">
                    {category.name}
                  </span>
                  <ArrowRight
                    aria-hidden
                    size={15}
                    className="shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-300"
                  />
                </span>
                <span className="mt-2 block text-xs text-zinc-500 dark:text-zinc-400">
                  {category.count} articles
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Latest Articles" href="/articles" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {latestArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Featured Articles" href="/articles" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {featured.map((article) => (
            <ArticleCard key={article.slug} article={article} compact />
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <TaxonomyList title="Categories" items={categories} basePath="/categories" />
        <TaxonomyList title="Tags" items={tags.slice(0, 24)} basePath="/tags" />
      </div>

      <section>
        <SectionHeader title="Series" href="/series" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {series.map((item) => (
            <Link
              key={item.slug}
              href={`/series/${item.slug}`}
              className="group rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <span className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  <Layers3 aria-hidden size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block break-words text-lg font-semibold leading-7 text-zinc-950 dark:text-zinc-50">
                    {item.name}
                  </span>
                  <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">
                    {item.count} articles
                  </span>
                </span>
              </span>
            </Link>
          ))}
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
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950">
      <Icon aria-hidden size={18} className="text-emerald-600 dark:text-emerald-400" />
      <span className="mt-3 block text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        {value}
      </span>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="section-title">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        View all
        <ArrowRight aria-hidden size={15} />
      </Link>
    </div>
  );
}
