import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import { describe, it } from "node:test";
import { getAllArticles } from "../lib/articles";
import { validateArticleQuality } from "../lib/article-quality";
import { parseMdxSource } from "../lib/mdx-source";

type Evidence = {
  kind: string;
  source: string;
  sha256: string;
  identity: Record<string, unknown>;
  source_urls: string[];
  image: string;
  image_sha256: string;
};
const hash = (file: string) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const records = JSON.parse(
  fs.readFileSync("test/fixtures/content-integrity.json", "utf8"),
) as Evidence[];
const articleRecords = records.filter(record => record.kind === "articles");
const articles = getAllArticles();
const migrated = articles.filter(a => a.editorialProfile === "question-led-v1");

describe("question-led content integrity", () => {
  it("requires matching published article content, sources and covers", () => {
    assert.equal(migrated.length, articleRecords.length);
    assert.equal(new Set(articleRecords.map(r => r.source)).size, articleRecords.length);
    for (const article of migrated) {
      const record = articleRecords.find(r => r.source === article.sourcePath);
      assert.ok(record, `${article.slug}: missing editorial record`);
      assert.equal(hash(article.sourcePath), record.sha256, "article changed after review");
      assert.equal(hash(record.image), record.image_sha256, "cover changed after review");
      assert.ok(record.source_urls.length > 0);
      for (const url of record.source_urls) assert.ok(article.content.includes(url));
      assert.deepEqual(validateArticleQuality(article).errors, []);
    }
  });

  it("preserves identity and taxonomy while allowing documented editorial metadata", () => {
    const editable = new Set(["title", "description", "updated", "editorialProfile"]);
    for (const record of articleRecords) {
      const current = parseMdxSource(fs.readFileSync(record.source, "utf8")).data;
      for (const key of new Set([...Object.keys(record.identity), ...Object.keys(current)])) {
        if (!editable.has(key)) assert.deepEqual(current[key], record.identity[key], `${record.source}: ${key}`);
      }
    }
  });

  it("rejects unfinished question-led content and keeps the legacy gate for unmigrated articles", () => {
    const article = migrated[0];
    assert.ok(article);
    assert.ok(validateArticleQuality({ ...article, content: "## Example\n\n```dart\nTestSubject\n" }).errors.length >= 3);
    assert.ok(validateArticleQuality({ ...article, editorialProfile: undefined }).errors.some(issue => issue.message.includes("required heading")));
    assert.equal(articles.length, 73);
    assert.equal(articles.filter(a => !a.editorialProfile).length, 73 - articleRecords.length);
  });
});
