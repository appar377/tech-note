import assert from "node:assert/strict";
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

  it("scores related articles by category, tags, and series", () => {
    const source = getAllArticles().find((article) => article.slug === "rails/sql/insert-select");

    assert.ok(source);
    const related = getRelatedArticles(source!);

    assert.match(related[0]?.slug ?? "", /^rails\/sql\//);
  });

  it("builds series as book pages with published chapters", () => {
    const series = getSeries();
    const databaseBook = series.find((item) => item.slug === "database-internal");
    const railsBook = series.find(
      (item) => item.name === "Railsで生SQLを書くときに知っておきたいSQL",
    );

    assert.ok(databaseBook);
    assert.match(databaseBook!.goal, /EXPLAIN/);
    assert.equal(databaseBook!.sections.every((section) => section.articles.length > 0), true);
    assert.equal(databaseBook!.articles.map((article) => article.series?.order).join(","), "1,2");

    assert.ok(railsBook);
    assert.equal(railsBook!.articles[0].slug, "rails/sql/raw-sql-summary");
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
