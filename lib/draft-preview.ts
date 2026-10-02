import { getAllArticles } from "./articles";

// Static exports must never include review manuscripts, even if the flag is set.
export function isDraftPreviewEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.TECH_NOTE_PREVIEW === "1"
  );
}

export function getReviewArticles() {
  if (!isDraftPreviewEnabled()) return [];
  return getAllArticles({ includeDrafts: true }).filter(
    (article) => article.draft,
  );
}
