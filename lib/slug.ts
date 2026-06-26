const segmentFormatter = new Intl.Segmenter("ja-JP", { granularity: "word" });

export function slugify(value: string) {
  const normalized = value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "untitled";
}

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalizeSearchText(value: string) {
  return Array.from(segmentFormatter.segment(value.toLowerCase()))
    .map((segment) => segment.segment.trim())
    .filter(Boolean)
    .join(" ");
}
