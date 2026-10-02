"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import type { SearchEntry } from "@/lib/articles";
import { contentKind, searchContent, type ContentKind } from "@/lib/search";

const kindLabels = {
  all: "すべて",
  articles: "記事",
  books: "ブック",
  notes: "ノート",
};

export function SearchPanel({
  index,
  compact = false,
  initialQuery = "",
}: {
  index: SearchEntry[];
  compact?: boolean;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [kind, setKind] = useState<ContentKind>("all");
  const [limit, setLimit] = useState(12);
  const inputId = useId();
  const categories = useMemo(
    () => [...new Set(index.map((entry) => entry.category))].sort(),
    [index],
  );
  const results = useMemo(
    () => searchContent(index, query, category, kind),
    [index, query, category, kind],
  );
  const showResults = !compact || query.trim().length > 0;
  const visibleResults = results.slice(0, compact ? 5 : limit);

  return (
    <div
      className={
        compact ? "content-search content-search--compact" : "content-search"
      }
    >
      <label htmlFor={inputId} className="search-label">
        キーワード
      </label>
      <div className="search-input-row">
        <input
          id={inputId}
          type="search"
          autoComplete="off"
          value={query}
          placeholder="例：Dart const、Rails トランザクション"
          onChange={(event) => {
            setQuery(event.target.value);
            setLimit(12);
          }}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setLimit(12);
            }}
          >
            クリア
          </button>
        ) : (
          <span aria-hidden>⌕</span>
        )}
      </div>
      {!compact ? (
        <div className="search-filters">
          <fieldset>
            <legend className="sr-only">読み物の種類</legend>
            {Object.entries(kindLabels).map(([value, label]) => (
              <button
                type="button"
                key={value}
                aria-pressed={kind === value}
                onClick={() => {
                  setKind(value as ContentKind);
                  setLimit(12);
                }}
              >
                {label}
              </button>
            ))}
          </fieldset>
          <label>
            分野
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setLimit(12);
              }}
            >
              <option value="">すべての分野</option>
              {categories.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
      ) : null}
      {showResults ? (
        <div className="search-results">
          <p role="status" aria-live="polite" className="result-count">
            {results.length}件
            {results.length > visibleResults.length
              ? `のうち${visibleResults.length}件を表示`
              : ""}
          </p>
          {visibleResults.map((result) => (
            <article key={result.url} className="search-result">
              <div className="article-row__meta">
                <span>{kindLabels[contentKind(result)]}</span>
                <span>{result.category}</span>
              </div>
              <h2>
                <Link href={result.url}>{result.title}</Link>
              </h2>
              <p>{result.description}</p>
            </article>
          ))}
          {results.length === 0 ? (
            <div className="empty-state">
              <p>一致する読み物はありません。</p>
              <p>キーワードを短くするか、分野を「すべて」に戻してください。</p>
            </div>
          ) : null}
          {!compact && results.length > limit ? (
            <button
              className="load-more"
              type="button"
              onClick={() => setLimit((current) => current + 12)}
            >
              さらに12件表示
            </button>
          ) : null}
          {compact && results.length > 5 ? (
            <Link
              className="text-link"
              href={{ pathname: "/search", query: { q: query } }}
            >
              検索ページで絞り込む →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
