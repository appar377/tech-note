import type { Metadata } from "next";
import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { getAllBooks } from "@/lib/books";

export const metadata: Metadata = {
  title: "ブック",
  description: "ひとつのテーマを章立てで読む技術書。",
};

export default function BooksPage() {
  return (
    <div className="page-shell narrow-collection">
      <header className="collection-header">
        <h1 className="page-heading">ブック</h1>
        <p className="page-subtitle">ひとつのテーマを、章立てで読む。</p>
      </header>
      <div className="book-list">
        {getAllBooks().map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>
      <p className="mt-10">
        <Link className="text-link" href="/series">
          記事を順にたどるシリーズも見る →
        </Link>
      </p>
    </div>
  );
}
