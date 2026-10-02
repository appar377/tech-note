import type { SearchEntry } from "./articles";

export type ContentKind = "all" | "articles" | "books" | "notes";

export function contentKind(entry: SearchEntry): Exclude<ContentKind, "all"> {
  if (entry.url.startsWith("/books/")) return "books";
  if (entry.url.startsWith("/notes/")) return "notes";
  return "articles";
}

export function searchContent(
  index: SearchEntry[],
  query: string,
  category = "",
  kind: ContentKind = "all",
) {
  const terms = query
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return index
    .filter(
      (entry) =>
        (!category || entry.category === category) &&
        (kind === "all" || contentKind(entry) === kind),
    )
    .map((entry) => {
      const title = entry.title.normalize("NFKC").toLowerCase();
      const metadata = [
        entry.description,
        entry.category,
        entry.tags.join(" "),
        entry.series ?? "",
      ]
        .join(" ")
        .normalize("NFKC")
        .toLowerCase();
      const content = entry.content.normalize("NFKC").toLowerCase();
      const matches = terms.every(
        (term) =>
          title.includes(term) ||
          metadata.includes(term) ||
          content.includes(term),
      );
      const score = terms.reduce(
        (sum, term) =>
          sum +
          (title.includes(term) ? 80 : 0) +
          (metadata.includes(term) ? 30 : 0),
        0,
      );
      return { entry, score, matches };
    })
    .filter((result) => result.matches)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.entry.date.localeCompare(a.entry.date) ||
        a.entry.title.localeCompare(b.entry.title),
    )
    .map(({ entry }) => entry);
}
