import Link from "next/link";
import type { TaxonomyItem } from "@/lib/articles";

export function TaxonomyList({
  title,
  items,
  basePath,
}: {
  title: string;
  items: TaxonomyItem[];
  basePath: "/categories" | "/tags";
}) {
  return (
    <section className="min-w-0 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">{items.length}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${basePath}/${item.slug}`}
            className="tech-shell inline-flex max-w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm text-zinc-700 transition hover:-translate-y-0.5 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            <span className="min-w-0 truncate">{item.name}</span>
            <span className="shrink-0 text-xs text-zinc-400">{item.count}</span>
            {item.description ? <span className="sr-only">{item.description}</span> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
