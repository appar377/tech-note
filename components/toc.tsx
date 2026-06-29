import Link from "next/link";
import type { TableOfContentsItem } from "@/lib/articles";

export function TableOfContents({ headings }: { headings: TableOfContentsItem[] }) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="tech-shell rounded-lg border p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Contents
      </p>
      <ol className="mt-3 space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${Math.max(0, heading.depth - 2) * 12}px` }}>
            <Link href={`#${heading.id}`} className="text-zinc-600 hover:text-cyan-700 dark:text-zinc-400 dark:hover:text-cyan-300">
              {heading.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
