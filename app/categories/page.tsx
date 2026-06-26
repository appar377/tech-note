import type { Metadata } from "next";
import { TaxonomyList } from "@/components/taxonomy-list";
import { getCategories } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Categories",
  description: "Tech Noteのカテゴリ一覧。",
  alternates: {
    canonical: absoluteUrl("/categories"),
  },
};

export default function CategoriesPage() {
  return (
    <div className="page-shell">
      <header className="mb-10">
        <h1 className="page-heading">Categories</h1>
        <p className="page-subtitle">技術領域ごとに記事を整理します。</p>
      </header>
      <TaxonomyList title="All Categories" items={getCategories()} basePath="/categories" />
    </div>
  );
}
