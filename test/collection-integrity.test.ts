import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import { describe, it } from "node:test";
import { parseMdxSource } from "../lib/mdx-source";
import { getAllBooks } from "../lib/books";
import { getAllNotes } from "../lib/notes";
import { getSeriesBookDefinition } from "../lib/series-books";

type Record = {
  kind: string;
  source: string;
  sha256: string;
  identity?: { [key: string]: unknown };
  mutable_metadata?: string[];
  source_urls: string[];
  image?: string;
  image_sha256?: string;
};
const rows = JSON.parse(fs.readFileSync("test/fixtures/content-integrity.json", "utf8")) as Record[];
const collections = rows.filter(row => row.kind !== "articles");
const hash = (file: string) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

describe("Books, Note and Series integrity", () => {
  it("checks published collection content, sources, identity and covers", () => {
    assert.equal(collections.length, 4);
    assert.equal(new Set(collections.map(row => row.source)).size, 4);
    for (const row of collections) {
      assert.equal(hash(row.source), row.sha256, `${row.source}: content changed after review`);
      if (row.image) assert.equal(hash(row.image), row.image_sha256);
      if (row.kind === "books") assert.ok(row.source_urls.length > 0);
      for (const url of row.source_urls) assert.ok(fs.readFileSync(row.source, "utf8").includes(url));
      if (row.identity) {
        const current = parseMdxSource(fs.readFileSync(row.source, "utf8")).data;
        for (const key of new Set([...Object.keys(current), ...Object.keys(row.identity)])) {
          if (!row.mutable_metadata?.includes(key)) assert.deepEqual(current[key], row.identity[key], `${row.source}: ${key}`);
        }
      }
    }
  });

  it("keeps the published collection identities and the existing one-article Series", () => {
    const books = getAllBooks();
    assert.deepEqual(books.map(book => book.slug).sort(), ["database-internal", "rails-raw-sql"]);
    for (const book of books) assert.equal(book.headings.filter(heading => heading.depth === 2).length, 6);
    const notes = getAllNotes();
    assert.equal(notes.length, 1);
    assert.equal(notes[0].url, "/notes/site-design/content-model");
    assert.equal(notes[0].status, "rough");
    assert.equal(notes[0].source, "ai-dialogue");
    const series = getSeriesBookDefinition("world-file-extensions");
    assert.ok(series);
    assert.equal(series.name, "世界の拡張子");
    assert.equal(series.category, "File Formats");
    assert.deepEqual(series.sections.flatMap(section => section.articleSlugs), ["file-formats/extensions/mdx"]);
    assert.deepEqual(series.references.map(reference => reference.href), [
      "https://www.iana.org/assignments/media-types/media-types.xhtml",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types",
    ]);
  });
});
