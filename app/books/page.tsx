import type { Metadata } from "next";
import { BookCard } from "@/components/book-card";
import { getAllBooks } from "@/lib/books";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Books",
  description: "Tech Noteの技術書ページ一覧。",
  alternates: {
    canonical: absoluteUrl("/books"),
  },
};

export default function BooksPage() {
  const books = getAllBooks();

  return (
    <div className="page-shell">
      <header className="mb-10">
        <h1 className="page-heading">Books</h1>
        <p className="page-subtitle">
          思いつきの記事を素材に、1つの目的へ向けて再構成した技術書ページです。
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {books.map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>
    </div>
  );
}
