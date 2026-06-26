import type { Metadata } from "next";
import { TaxonomyList } from "@/components/taxonomy-list";
import { getTags } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tags",
  description: "Tech Noteのタグ一覧。",
  alternates: {
    canonical: absoluteUrl("/tags"),
  },
};

export default function TagsPage() {
  return (
    <div className="page-shell">
      <header className="mb-10">
        <h1 className="page-heading">Tags</h1>
        <p className="page-subtitle">記事に付けた技術キーワードから探します。</p>
      </header>
      <TaxonomyList title="All Tags" items={getTags()} basePath="/tags" />
    </div>
  );
}
