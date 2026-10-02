import Link from "next/link";
import type { Book } from "@/lib/books";
import { withBasePath } from "@/lib/site";

export function BookCard({
  book,
  compact = false,
}: {
  book: Book;
  compact?: boolean;
}) {
  return (
    <article className={`book-entry${compact ? " book-entry--compact" : ""}`}>
      {book.cover ? (
        <Link
          href={book.url}
          className="book-entry__cover"
          tabIndex={-1}
          aria-label={`${book.title}を読む`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath(book.cover)}
            alt=""
            width={1200}
            height={675}
            loading="lazy"
          />
        </Link>
      ) : null}
      <div>
        <p className="eyebrow">
          {book.category} · {book.readingTimeMinutes}分
        </p>
        <h2>
          <Link href={book.url}>{book.title}</Link>
        </h2>
        <p>{book.subtitle}</p>
        <Link href={book.url} className="text-link">
          目次から読む →
        </Link>
      </div>
    </article>
  );
}
