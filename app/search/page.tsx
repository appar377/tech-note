import type { Metadata } from "next";
import { SearchPanel } from "@/components/search-panel";
import { getSearchIndex } from "@/lib/articles";
import { getBookSearchIndex } from "@/lib/books";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Search",
  description: "Tech NoteのBooksとArticlesをタイトル、本文、タグ、カテゴリから検索。",
  alternates: {
    canonical: absoluteUrl("/search"),
  },
};

export default function SearchPage() {
  return (
    <div className="page-shell">
      <header className="mb-8">
        <h1 className="page-heading">Search</h1>
        <p className="page-subtitle">BooksとArticlesを横断して検索します。</p>
      </header>
      <SearchPanel index={[...getBookSearchIndex(), ...getSearchIndex()]} />
    </div>
  );
}
