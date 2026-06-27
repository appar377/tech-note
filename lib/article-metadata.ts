export const ARTICLE_TYPE_LABELS = {
  internal: "Internal",
  practical: "Practical",
  reference: "Reference",
} as const;

export type ArticleType = keyof typeof ARTICLE_TYPE_LABELS;
export type ArticleLevel = 1 | 2 | 3;

export function formatArticleLevel(level: ArticleLevel) {
  return `Lv${level}`;
}

export function formatArticleType(type: ArticleType) {
  return ARTICLE_TYPE_LABELS[type];
}

