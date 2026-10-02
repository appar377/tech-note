import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { describe, it } from "node:test";
import {
  getAdjacentArticles,
  getAllArticles,
  getSearchIndex,
} from "../lib/articles";
import { getReviewArticles, isDraftPreviewEnabled } from "../lib/draft-preview";
import { validateQuestionLedArticle } from "../lib/editorial-quality";
import { searchContent } from "../lib/search";
import { getBookSearchIndex } from "../lib/books";
import { getNoteSearchIndex } from "../lib/notes";

describe("reading and review boundaries", () => {
  it("excludes draft files from public articles and search using synthetic content", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tech-note-drafts-"));
    try {
      fs.mkdirSync(path.join(directory, "articles"));
      for (const [name, draft] of [["visible", false], ["hidden", true]] as const) {
        fs.writeFileSync(path.join(directory, "articles", `${name}.mdx`),
          `---\ntitle: ${name}\ndescription: Synthetic test content\ndate: 2026-01-01\ncategory: Dart\nlevel: 1\narticleType: reference\ndraft: ${draft}\n---\n## Example\n\nSynthetic content.\n`);
      }
      const articleModule = path.resolve("lib/articles.ts");
      const draftModule = path.resolve("lib/draft-preview.ts");
      const require = createRequire(path.resolve("package.json"));
      const loader = pathToFileURL(require.resolve("tsx")).href;
      const output = execFileSync(process.execPath, ["--import", loader, "--input-type=commonjs", "-e", `
        const { getAllArticles, getSearchIndex } = require(${JSON.stringify(articleModule)});
        const { getReviewArticles } = require(${JSON.stringify(draftModule)});
        process.env.TECH_NOTE_PREVIEW = '1';
        process.env.NODE_ENV = 'production';
        const productionDrafts = getReviewArticles().length;
        process.env.NODE_ENV = 'development';
        console.log(JSON.stringify({
          all: getAllArticles({includeDrafts:true}).map(a => a.slug).sort(),
          published: getAllArticles().map(a => a.slug),
          search: getSearchIndex().map(a => a.title),
          productionDrafts,
          developmentDrafts: getReviewArticles().map(a => a.slug)
        }));
      `], { cwd: directory, encoding: "utf8" });
      assert.deepEqual(JSON.parse(output), {
        all: ["hidden", "visible"], published: ["visible"], search: ["visible"],
        productionDrafts: 0, developmentDrafts: ["hidden"],
      });
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it("never exposes review manuscripts in production, including with the preview flag", () => {
    const original = {
      NODE_ENV: process.env.NODE_ENV,
      TECH_NOTE_PREVIEW: process.env.TECH_NOTE_PREVIEW,
    };
    try {
      for (const environment of ["production", "test", "development"]) {
        Object.assign(process.env, {
          NODE_ENV: environment,
          TECH_NOTE_PREVIEW: "1",
        });
        assert.equal(isDraftPreviewEnabled(), environment === "development");
        if (environment !== "development") assert.deepEqual(getReviewArticles(), []);
      }
      process.env.TECH_NOTE_PREVIEW = "0";
      assert.deepEqual(getReviewArticles(), []);
    } finally {
      for (const [name, value] of Object.entries(original)) {
        if (value === undefined) delete process.env[name];
        else process.env[name] = value;
      }
    }
  });

  it("keeps adjacent navigation in the same topic", () => {
    for (const slug of ["flutter/dart/dart-final-vs-const", "rails/rspec/stub-mock-meaning"]) {
      const article = getAllArticles().find(item => item.slug === slug)!;
      const { previous, next } = getAdjacentArticles(article);
      assert.ok(previous || next);
      for (const neighbor of [previous, next]) {
        if (neighbor) assert.deepEqual(neighbor.slugSegments.slice(0, -1), article.slugSegments.slice(0, -1));
      }
    }
  });

  it("allows short question-led articles while rejecting unfinished or unsupported manuscripts", () => {
    const article = getAllArticles()[0];
    const valid = {
      ...article,
      content: "短い説明。[仕様](https://dart.dev/language/variables)\n",
      articleType: "reference" as const,
      plainText: "短い説明。",
    };
    assert.deepEqual(validateQuestionLedArticle(valid).errors, []);
    assert.ok(
      validateQuestionLedArticle({ ...valid, content: "出典なし" }).errors
        .length,
    );
    assert.ok(
      validateQuestionLedArticle({
        ...valid,
        content: valid.content + "\nTODO\n",
      }).errors.length,
    );
    assert.ok(
      validateQuestionLedArticle({
        ...valid,
        content: valid.content + "\n```dart\nvoid main() {}",
      }).errors.length,
    );
  });
});

describe("content search", () => {
  const index = [
    ...getSearchIndex(),
    ...getBookSearchIndex(),
    ...getNoteSearchIndex(),
  ];
  it("matches all terms and normalizes full-width input", () => {
    assert.ok(searchContent(index, "Ｄａｒｔ const").length > 0);
    assert.equal(
      searchContent(index, "Dart impossible_unmatched_term").length,
      0,
    );
  });
  it("combines category and content kind filters", () => {
    const results = searchContent(index, "", "Database", "books");
    assert.ok(results.length > 0);
    assert.ok(
      results.every(
        (entry) =>
          entry.url.startsWith("/books/") && entry.category === "Database",
      ),
    );
    assert.equal(searchContent(index, "", "nonexistent", "all").length, 0);
  });
});
