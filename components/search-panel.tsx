"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { SearchEntry } from "@/lib/articles";

type SearchPanelProps = {
  index: SearchEntry[];
  compact?: boolean;
};

export function SearchPanel({ index, compact = false }: SearchPanelProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const terms = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (terms.length === 0) {
      return [];
    }

    return index
      .map((entry) => ({
        entry,
        score: scoreEntry(entry, terms),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.entry.date.localeCompare(a.entry.date))
      .slice(0, compact ? 5 : 12)
      .map((item) => item.entry);
  }, [compact, index, query]);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <label className="relative block">
        <Search
          aria-hidden
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ROW_NUMBER, Rails UPSERT, GitHub Pages..."
          className="h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-10 pr-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:bg-zinc-950"
        />
      </label>
      {query ? (
        <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-900">
          {results.length > 0 ? (
            results.map((result) => (
              <Link key={result.url} href={result.url} className="block rounded-md px-2 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <span className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {result.title}
                </span>
                <span className="mt-1 line-clamp-1 block text-xs text-zinc-500 dark:text-zinc-400">
                  {result.description}
                </span>
              </Link>
            ))
          ) : (
            <p className="px-2 py-4 text-sm text-zinc-500 dark:text-zinc-400">
              該当する記事はありません。
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function scoreEntry(entry: SearchEntry, terms: string[]) {
  const haystack = {
    title: entry.title.toLowerCase(),
    description: entry.description.toLowerCase(),
    category: entry.category.toLowerCase(),
    tags: entry.tags.join(" ").toLowerCase(),
    series: entry.series?.toLowerCase() ?? "",
    content: entry.content.toLowerCase(),
  };

  return terms.reduce((score, term) => {
    if (haystack.title.includes(term)) score += 80;
    if (haystack.description.includes(term)) score += 35;
    if (haystack.category.includes(term)) score += 30;
    if (haystack.tags.includes(term)) score += 30;
    if (haystack.series.includes(term)) score += 25;
    if (haystack.content.includes(term)) score += 10;
    return score;
  }, 0);
}
