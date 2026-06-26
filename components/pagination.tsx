import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const previousHref = currentPage === 2 ? "/articles" : `/article-pages/${currentPage - 1}`;
  const nextHref = `/article-pages/${currentPage + 1}`;

  return (
    <nav className="flex items-center justify-between border-t border-zinc-200 pt-8 dark:border-zinc-800">
      {currentPage > 1 ? (
        <Link className="icon-text-button" href={previousHref}>
          <ChevronLeft aria-hidden size={17} />
          Newer
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link className="icon-text-button" href={nextHref}>
          Older
          <ChevronRight aria-hidden size={17} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
