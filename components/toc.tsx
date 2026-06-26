import Link from "next/link";
import type { TableOfContentsItem } from "@/lib/articles";

export function TableOfContents({ headings }: { headings: TableOfContentsItem[] }) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Contents
      </p>
      <ol className="mt-3 space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${Math.max(0, heading.depth - 2) * 12}px` }}>
            <Link href={`#${heading.id}`} className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
              {heading.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
