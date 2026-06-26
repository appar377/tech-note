import type { Metadata } from "next";
import { SearchPanel } from "@/components/search-panel";
import { getSearchIndex } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Search",
  description: "Tech Noteの記事をタイトル、本文、タグ、カテゴリから検索。",
  alternates: {
    canonical: absoluteUrl("/search"),
  },
};

export default function SearchPage() {
  return (
    <div className="page-shell">
      <header className="mb-8">
        <h1 className="page-heading">Search</h1>
        <p className="page-subtitle">タイトル、本文、タグ、カテゴリを対象にインクリメンタル検索します。</p>
      </header>
      <SearchPanel index={getSearchIndex()} />
    </div>
  );
}
