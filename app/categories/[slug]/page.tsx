import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getArticlesByCategory, getCategories } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getCategories().map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategories().find((item) => item.slug === slug);

  if (!category) return {};

  return {
    title: category.name,
    description: `${category.name} の記事一覧。`,
    alternates: {
      canonical: absoluteUrl(`/categories/${category.slug}`),
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategories().find((item) => item.slug === slug);
  const articles = getArticlesByCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="page-shell">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: category.name }]} />
      <header className="mb-10 mt-8">
        <h1 className="page-heading">{category.name}</h1>
        <p className="page-subtitle">{category.count} articles</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
