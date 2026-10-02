"use client";

import { useSearchParams } from "next/navigation";
import type { SearchEntry } from "@/lib/articles";
import { SearchPanel } from "./search-panel";

export function SearchFromUrl({ index }: { index: SearchEntry[] }) {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  return <SearchPanel key={query} index={index} initialQuery={query} />;
}
