"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

export function DraftSelection({
  entries,
}: {
  entries: { slug: string; title: string; reader: ReactNode }[];
}) {
  const selected = useSearchParams().get("article");
  const entry = selected
    ? entries.find((item) => item.slug === selected)
    : entries[0];
  if (!entry)
    return (
      <div className="page-shell">
        <p>指定された下書きはありません。</p>
        <Link href="/drafts">下書き一覧へ戻る</Link>
      </div>
    );
  return <article className="page-shell reader-shell">{entry.reader}</article>;
}
