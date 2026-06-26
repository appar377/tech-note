export function formatDate(value?: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function pluralize(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
