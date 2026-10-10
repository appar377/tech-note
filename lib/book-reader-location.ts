export type BookReadingMode = "continuous" | "pages";

export type BookReaderPosition = {
  mode: BookReadingMode;
  page: number;
};

export function clampBookPage(page: number, totalPages: number) {
  return Math.min(Math.max(1, Math.trunc(page) || 1), Math.max(1, totalPages));
}

export function readBookReaderLocation(url: URL, totalPages: number, anchorPage?: number): BookReaderPosition {
  const requestedPage = url.searchParams.get("page") ?? "1";
  const page = /^\d+$/.test(requestedPage) ? Number(requestedPage) : 1;
  return {
    mode: url.searchParams.get("reader") === "pages" ? "pages" : "continuous",
    page: clampBookPage(anchorPage ?? page, totalPages),
  };
}

export function bookReaderUrl(url: URL, position: BookReaderPosition, anchor = "") {
  const next = new URL(url);
  if (position.mode === "pages") {
    next.searchParams.set("reader", "pages");
    next.searchParams.set("page", String(position.page));
  } else {
    next.searchParams.delete("reader");
    next.searchParams.delete("page");
  }
  next.hash = anchor;
  return `${next.pathname}${next.search}${next.hash}`;
}
