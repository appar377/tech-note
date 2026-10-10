import type { Element, Root, RootContent } from "hast";
import { toString } from "hast-util-to-string";

const PAGE_READING_UNITS = 1150;

type BookPage = {
  children: RootContent[];
  label: string;
  chapterId: string;
};

/** Group complete rendered blocks so code, tables and MDX components stay intact. */
export function paginateBookTree(tree: Root, pageSize = PAGE_READING_UNITS) {
  const pages: BookPage[] = [];
  const definitions: RootContent[] = [];
  let current: RootContent[] = [];
  let pending: RootContent[] = [];
  let units = 0;
  let chapterId = "";
  let chapterLabel = "はじめに";
  let pageLabel = chapterLabel;
  let headingNeedsContent = false;

  const finishPage = () => {
    if (!current.length) return;
    pages.push({ children: current, label: pageLabel, chapterId });
    current = [];
    units = 0;
    headingNeedsContent = false;
    pageLabel = chapterLabel;
  };

  for (const node of tree.children) {
    // ESM definitions must remain at the MDX root rather than inside a section.
    if (node.type === "mdxjsEsm") {
      definitions.push(node);
      continue;
    }
    if (isRetainedMarker(node)) {
      pending.push(node);
      continue;
    }

    const heading = node.type === "element" && isHeading(node) ? node : undefined;
    const nodeUnits = estimateReadingUnits(node);
    const startsChapter = heading?.tagName === "h2";
    if (current.length && (startsChapter || (!headingNeedsContent && units + nodeUnits > pageSize))) {
      finishPage();
    }
    if (startsChapter) {
      chapterId = String(heading.properties.id ?? "");
      chapterLabel = headingText(heading);
    }
    if (!current.length) pageLabel = heading ? headingText(heading) : chapterLabel;

    current.push(...pending, node);
    pending = [];
    units += nodeUnits;
    headingNeedsContent = Boolean(heading);
  }

  current.push(...pending);
  finishPage();
  tree.children = [
    ...definitions,
    ...pages.map((page, index): Element => ({
      type: "element",
      tagName: "section",
      properties: {
        "data-book-page": String(index + 1),
        "data-book-page-label": page.label,
        "data-book-chapter-id": page.chapterId,
        "aria-label": `ページ ${index + 1}: ${page.label}`,
      },
      children: page.children as Element["children"],
    })),
  ];
  return tree;
}

/** Runs after slugging, syntax highlighting and callouts, once for the whole book. */
export function rehypeBookPages() {
  return (tree: Root) => { paginateBookTree(tree); };
}

function isHeading(node: RootContent) {
  return node.type === "element" && /^h[1-6]$/.test(node.tagName);
}

function headingText(node: Element) {
  return toString(node).replace(/\s*#\s*$/, "").trim();
}

function isRetainedMarker(node: RootContent) {
  if (node.type === "text") return !node.value.trim();
  if (node.type === "comment") return true;
  if (node.type === "element") return node.tagName === "span" && !toString(node).trim();
  // MDX retained bookmarks are JSX nodes before they become real DOM spans.
  return node.type === "mdxJsxFlowElement" && node.name === "span" && !toString(node).trim();
}

function estimateReadingUnits(node: RootContent) {
  const text = toString(node);
  const textUnits = [...text].reduce((total, character) => total + (/[\u0000-\u007f]/.test(character) ? 0.55 : 1), 0);
  if (node.type === "element") {
    if (isHeading(node)) return 105;
    if (node.tagName === "table") return Math.max(textUnits, countElements(node, "tr") * 95);
    if (node.tagName === "pre" || countElements(node, "pre")) {
      return Math.max(textUnits, text.split("\n").length * 38) + 120;
    }
    if (node.tagName === "figure" || node.tagName === "img") return Math.max(textUnits, 500);
  }
  if (node.type === "mdxJsxFlowElement") return Math.max(textUnits, 600);
  return Math.max(textUnits, 30) + 60;
}

function countElements(node: Element, tagName: string): number {
  return Number(node.tagName === tagName) + node.children.reduce((total, child) => (
    total + (child.type === "element" ? countElements(child, tagName) : 0)
  ), 0);
}
