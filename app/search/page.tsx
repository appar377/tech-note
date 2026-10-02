import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchFromUrl } from "@/components/search-from-url";
import { getSearchIndex } from "@/lib/articles";
import { getBookSearchIndex } from "@/lib/books";
import { getNoteSearchIndex } from "@/lib/notes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "検索",
  description: "記事・ブック・ノートをキーワードと分野で検索。",
  alternates: { canonical: absoluteUrl("/search") },
};

export default function SearchPage() {
  return (
    <div className="page-shell search-page">
      <header className="collection-header">
        <h1 className="page-heading">検索</h1>
        <p className="page-subtitle">
          記事・ブック・ノートの本文まで探せます。
        </p>
      </header>
      <Suspense fallback={<p role="status">検索を準備しています。</p>}>
        <SearchFromUrl
          index={[
            ...getSearchIndex(),
            ...getBookSearchIndex(),
            ...getNoteSearchIndex(),
          ]}
        />
      </Suspense>
    </div>
  );
}
