import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  estimateReadingTime,
  extractHeadings,
  getAllArticles,
  getRelatedArticles,
  getSeries,
  getSearchIndex,
  parseArticleFile,
} from "../lib/articles";
import { validateArticlesQuality } from "../lib/article-quality";
import { getAllBooks, getBookBySlug, getBookForSeries, getBookSearchIndex } from "../lib/books";

describe("articles", () => {
  it("loads published MDX articles with path-based slugs", () => {
    const articles = getAllArticles();

    assert.ok(articles.length > 0);
    assert.ok(articles.map((article) => article.slug).includes("rails/sql/insert-select"));
    assert.equal(articles.every((article) => article.url.startsWith("/articles/")), true);
  });

  it("parses frontmatter and reading time", () => {
    const article = parseArticleFile("articles/rails/sql/insert-select.mdx");

    assert.match(article.title, /INSERT SELECT/);
    assert.equal(article.categorySlug, "rails");
    assert.equal(article.level, 1);
    assert.equal(article.articleType, "practical");
    assert.ok(article.readingTimeMinutes >= 1);
  });

  it("extracts markdown headings for table of contents", () => {
    const headings = extractHeadings("## Overview\n\n### Detail\n\n```sql\n## ignored\n```");

    assert.deepEqual(headings, [
      { id: "overview", text: "Overview", depth: 2 },
      { id: "detail", text: "Detail", depth: 3 },
    ]);
  });

  it("keeps code and identifier characters in table-of-contents anchors", () => {
    assert.deepEqual(extractHeadings(
      "## query_parametersとparams\n## `to_unsafe_h`と**許可**\n## `to_unsafe_h`と**許可**\n### _強調_ と`a*b`",
    ), [
      { id: "query_parametersとparams", text: "query_parametersとparams", depth: 2 },
      { id: "to_unsafe_hと許可", text: "to_unsafe_hと許可", depth: 2 },
      { id: "to_unsafe_hと許可-1", text: "to_unsafe_hと許可", depth: 2 },
      { id: "強調-とab", text: "強調 とa*b", depth: 3 },
    ]);
  });

  it("scores related articles by category, tags, and series", () => {
    const source = getAllArticles().find((article) => article.slug === "rails/sql/insert-select");

    assert.ok(source);
    const related = getRelatedArticles(source!);

    assert.match(related[0]?.slug ?? "", /^rails\/sql\//);
  });

  it("builds series as themed article groups", () => {
    const series = getSeries();
    const extensionSeries = series.find((item) => item.name === "世界の拡張子");

    assert.equal(series.length, 3);
    assert.ok(extensionSeries);
    assert.equal(extensionSeries!.slug, "world-file-extensions");
    assert.match(extensionSeries!.goal, /拡張子/);
    assert.equal(
      extensionSeries!.sections.every((section) => section.articles.length > 0),
      true,
    );
    assert.equal(extensionSeries!.articles[0].slug, "file-formats/extensions/mdx");
  });

  it("builds a static search index", () => {
    const index = getSearchIndex();

    assert.ok("title" in index[0]);
    assert.ok("level" in index[0]);
    assert.ok("articleType" in index[0]);
    assert.equal(index.some((entry) => entry.content.includes("row_number")), true);
  });

  it("loads books as independent MDX content with reference articles", () => {
    const books = getAllBooks();
    const databaseBook = getBookBySlug("database-internal");
    const railsBook = getBookForSeries("Railsで生SQLを書くときに知っておきたいSQL");
    const bookIndex = getBookSearchIndex();

    assert.ok(books.length >= 2);
    assert.ok(databaseBook);
    assert.equal(databaseBook!.cover, "/images/books/database-internal-cover.png");
    assert.equal(databaseBook!.references[0].href.startsWith("/articles/"), true);
    assert.match(databaseBook!.plainText, /SQLがDB内部で/);
    assert.ok(railsBook);
    assert.equal(railsBook!.slug, "rails-raw-sql");
    assert.equal(bookIndex.some((entry) => entry.url === "/books/database-internal"), true);
  });

  it("keeps the Codex 40-article specification package wired to published content", () => {
    const manifestPath = path.join(process.cwd(), "codex_article_specs", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      articles: Array<{
        id: string;
        slug: string;
        spec_path: string;
      }>;
    };
    const articles = getAllArticles();

    assert.equal(manifest.articles.length, 40);

    for (const item of manifest.articles) {
      const article = articles.find(
        (candidate) => candidate.slug === item.slug || candidate.slug.endsWith(`/${item.slug}`),
      );
      const expectedThumbnail = `/images/articles/${item.slug}.png`;
      const thumbnailPath = path.join(process.cwd(), "public", expectedThumbnail.replace(/^\//, ""));
      const specPath = path.join(process.cwd(), "codex_article_specs", item.spec_path);

      assert.ok(article, `${item.id} ${item.slug} article is published`);
      assert.equal(article!.thumbnail, expectedThumbnail, `${item.slug} thumbnail path`);
      assert.equal(fs.existsSync(thumbnailPath), true, `${item.slug} thumbnail file exists`);
      assert.equal(fs.existsSync(specPath), true, `${item.slug} individual spec file exists`);
    }
  });

  it("estimates a minimum reading time", () => {
    assert.equal(estimateReadingTime("短い本文"), 1);
  });

  it("enforces published article quality gates", () => {
    const report = validateArticlesQuality(getAllArticles());

    for (const warning of report.warnings) {
      console.warn(`[article-quality] ${warning.article}: ${warning.message}`);
    }

    assert.deepEqual(report.errors, []);
  });
});
