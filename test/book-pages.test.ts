import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Element, Root, RootContent } from "hast";
import { renderToStaticMarkup } from "react-dom/server";
import { getAllBooks } from "../lib/books";
import { paginateBookTree, rehypeBookPages } from "../lib/book-pages";
import { bookReaderUrl, clampBookPage, readBookReaderLocation } from "../lib/book-reader-location";

function element(tagName: string, text: string, id?: string): Element {
  return { type: "element", tagName, properties: id ? { id } : {}, children: [{ type: "text", value: text }] };
}

describe("book pagination preserves complete document blocks", () => {
  it("keeps every block once, keeps bookmarks with the next chapter, and never fragments a long code block", () => {
    const intro = element("p", "導入".repeat(150));
    const first = element("h2", "章A", "chapter-a");
    const paragraph = element("p", "本文".repeat(150));
    const code = element("pre", "SELECT very_long_expression;\n".repeat(100));
    const bookmark: Element = { type: "element", tagName: "span", properties: { id: "retained" }, children: [] };
    const second = element("h2", "章B", "chapter-b");
    const table = element("table", "表内容".repeat(1000));
    const nodes = [intro, first, paragraph, code, bookmark, second, table];
    const tree: Root = { type: "root", children: nodes };
    paginateBookTree(tree, 400);
    const pages = tree.children as Element[];
    assert.deepEqual(pages.flatMap(page => page.children), nodes);
    assert.ok(pages.length > 3, "chapters can span multiple sequential pages");
    assert.equal(pages.find(page => page.children.includes(bookmark)), pages.find(page => page.children.includes(second)));
    assert.equal(pages.filter(page => page.children.includes(code)).length, 1);
    assert.equal(pages.find(page => page.children.includes(first)), pages.find(page => page.children.includes(paragraph)), "heading retains its first body block");
    assert.equal(pages.find(page => page.children.includes(second)), pages.find(page => page.children.includes(table)), "an oversized table remains readable with its heading");
    assert.deepEqual(pages.map(page => page.properties["data-book-page"]), pages.map((_, index) => String(index + 1)));
  });

  it("leaves MDX definitions at root and preserves a complete client component and its nested blocks", () => {
    const definition: RootContent = { type: "mdxjsEsm", value: "export const example = true" };
    const widget: RootContent = { type: "mdxJsxFlowElement", name: "Accordion", attributes: [], children: [element("p", "nested content")] };
    const tree: Root = { type: "root", children: [definition, element("h2", "Widget", "widget"), widget] };
    paginateBookTree(tree, 100);
    assert.equal(tree.children[0], definition);
    const page = tree.children[1] as Element;
    assert.equal(page.children[1], widget);
    assert.equal(page.properties["data-book-chapter-id"], "widget");
  });

  it("retains whole-book duplicate heading slugs, cross-page links and footnotes in one compilation", async () => {
    const [{ compileMDX }, { default: remarkGfm }, { default: rehypeSlug }] = await Promise.all([
      import("next-mdx-remote/rsc"), import("remark-gfm"), import("rehype-slug"),
    ]);
    const source = `## Repeat\n\n[Next](#repeat-1) and a note[^same].\n\n${"Paragraph. ".repeat(200)}\n\n<span id="old-bookmark"></span>\n\n## Repeat\n\nThe second chapter uses the same note[^same].\n\n[^same]: Shared footnote.\n`;
    const render = async (paginate: boolean) => {
      const { content } = await compileMDX({ source, options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, ...(paginate ? [rehypeBookPages] : [])] } } });
      return renderToStaticMarkup(content);
    };
    const plain = await render(false);
    const paged = await render(true);
    assert.deepEqual([...paged.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]), [...plain.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));
    assert.deepEqual([...paged.matchAll(/\shref="([^"]+)"/g)].map(match => match[1]), [...plain.matchAll(/\shref="([^"]+)"/g)].map(match => match[1]));
    assert.match(paged, /id="repeat-1"/);
    assert.match(paged, /id="old-bookmark"/);
    assert.equal((paged.match(/Shared footnote\./g) ?? []).length, 1);
    assert.ok((paged.match(/data-book-page="/g) ?? []).length >= 3);
  });

  it("compiles every published book into pages without dropping headings, links, code or tables", async () => {
    const [{ compileMDX }, { default: remarkGfm }, { default: rehypeSlug }] = await Promise.all([
      import("next-mdx-remote/rsc"), import("remark-gfm"), import("rehype-slug"),
    ]);
    for (const book of getAllBooks()) {
      const render = async (paginate: boolean) => {
        const { content } = await compileMDX({ source: book.content, options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, ...(paginate ? [rehypeBookPages] : [])] } } });
        return renderToStaticMarkup(content);
      };
      const [plain, paged] = await Promise.all([render(false), render(true)]);
      for (const pattern of [/\sid="([^"]+)"/g, /\shref="([^"]+)"/g, /<pre[\s>]/g, /<table[\s>]/g]) {
        assert.deepEqual([...paged.matchAll(pattern)].map(match => match[0]), [...plain.matchAll(pattern)].map(match => match[0]), book.slug);
      }
      assert.ok((paged.match(/data-book-page="/g) ?? []).length > book.headings.filter(heading => heading.depth === 2).length, book.slug);
    }
  });
});

describe("book reader URL and bounded position", () => {
  it("restores mode and page, with known anchors taking precedence over a stale page index", () => {
    const url = new URL("https://example.test/tech-note/books/sample/?reader=pages&page=5#retained");
    assert.deepEqual(readBookReaderLocation(url, 8), { mode: "pages", page: 5 });
    assert.deepEqual(readBookReaderLocation(url, 8, 2), { mode: "pages", page: 2 });
    for (const page of ["bad", "-3", "2.5", "0"]) {
      url.searchParams.set("page", page);
      assert.equal(readBookReaderLocation(url, 8).page, 1);
    }
    url.searchParams.set("page", "99");
    assert.equal(readBookReaderLocation(url, 8).page, 8);
    assert.deepEqual(readBookReaderLocation(new URL("https://example.test/books/sample/#retained"), 8, 2), { mode: "continuous", page: 2 });
  });

  it("preserves basePath and unrelated parameters while clearing stale hashes on page turns", () => {
    const url = new URL("https://example.test/tech-note/books/sample/?campaign=keep#old");
    assert.equal(bookReaderUrl(url, { mode: "pages", page: 3 }), "/tech-note/books/sample/?campaign=keep&reader=pages&page=3");
    assert.equal(bookReaderUrl(new URL("https://example.test/tech-note/books/sample/?campaign=keep&reader=pages&page=3"), { mode: "continuous", page: 3 }, "章"), "/tech-note/books/sample/?campaign=keep#%E7%AB%A0");
  });

  it("bounds every rapid relative move at the beginning and end", () => {
    let page = 1;
    for (let index = 0; index < 200; index++) page = clampBookPage(page + 1, 12);
    assert.equal(page, 12);
    for (let index = 0; index < 200; index++) page = clampBookPage(page - 1, 12);
    assert.equal(page, 1);
    assert.equal(clampBookPage(Number.NaN, 12), 1);
  });
});
