import Link from "next/link";
import { ArrowRight, BookOpen, Boxes, Hash, Library, Search } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { SearchPanel } from "@/components/search-panel";
import { TaxonomyList } from "@/components/taxonomy-list";
import { getAllArticles, getCategories, getSearchIndex, getSeries, getTags } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles();
  const categories = getCategories();
  const tags = getTags();
  const series = getSeries();
  const latestArticles = articles.slice(0, 4);
  const popularArticles = articles.filter((article) => article.popular).slice(0, 3);
  const featuredPopular = popularArticles.length > 0 ? popularArticles : articles.slice(0, 3);

  return (
    <div className="page-shell space-y-14">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <Library aria-hidden size={15} />
            Personal technology library
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
            Tech Note
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Markdownを書くだけで公開される、技術知識のSingle Source of Truth。
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Metric icon={BookOpen} label="Articles" value={articles.length} />
            <Metric icon={Boxes} label="Categories" value={categories.length} />
            <Metric icon={Hash} label="Tags" value={tags.length} />
          </div>
        </div>
        <div className="space-y-3">
          <SearchPanel index={getSearchIndex()} compact />
          <div className="grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="rounded-lg border border-zinc-200 bg-white p-4 text-sm transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
              >
                <span className="block font-semibold text-zinc-950 dark:text-zinc-50">
                  {category.name}
                </span>
                <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
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
        <SectionHeader title="Popular Articles" href="/articles" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {featuredPopular.map((article) => (
            <ArticleCard key={article.slug} article={article} />
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
              className="rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <span className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                {item.name}
              </span>
              <span className="mt-2 block text-sm text-zinc-500 dark:text-zinc-400">
                {item.count} articles
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
  icon: typeof Search;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
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
      <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
        View all
        <ArrowRight aria-hidden size={15} />
      </Link>
    </div>
  );
}
