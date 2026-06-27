import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  estimateReadingTime,
  extractHeadings,
  getAllArticles,
  stripMarkdown,
  type SearchEntry,
  type TableOfContentsItem,
} from "./articles";
import { compareKnowledgeDomainSlugs } from "./knowledge-domains";
import { listMdxFiles, parseMdxSource } from "./mdx-source";
import { absoluteUrl } from "./site";
import { normalizeSearchText, slugify } from "./slug";

const PROJECT_ROOT = /* turbopackIgnore: true */ process.cwd();
const BOOKS_DIR = path.join(/* turbopackIgnore: true */ PROJECT_ROOT, "books");

const dateStringSchema = z.preprocess((value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value;
}, z.string().min(1));

const bookReferenceSchema = z
  .object({
    title: z.string().min(1).optional(),
    articleSlug: z.string().min(1).optional(),
    href: z.string().min(1).optional(),
    note: z.string().min(1).optional(),
  })
  .refine((reference) => reference.articleSlug || reference.href, {
    message: "Book references require articleSlug or href",
  });

const bookFrontmatterSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  date: dateStringSchema,
  updated: dateStringSchema.optional(),
  category: z.string().min(1),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  access: z.enum(["free", "premium"]).default("free"),
  status: z.enum(["draft", "published"]).default("published"),
  featured: z.boolean().default(false),
  aliases: z.array(z.string().min(1)).default([]),
  references: z.array(bookReferenceSchema).default([]),
});

export type BookFrontmatter = z.infer<typeof bookFrontmatterSchema>;
export type BookAccess = BookFrontmatter["access"];

export type BookReference = {
  title: string;
  href: string;
  note?: string;
  articleSlug?: string;
};

export type Book = {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  categorySlug: string;
  level: 1 | 2 | 3;
  access: BookAccess;
  status: "draft" | "published";
  featured: boolean;
  aliases: string[];
  references: BookReference[];
  slug: string;
  sourcePath: string;
  url: string;
  canonicalUrl: string;
  content: string;
  plainText: string;
  readingTimeMinutes: number;
  headings: TableOfContentsItem[];
};

export function getAllBooks(options: { includeDrafts?: boolean } = {}) {
  return listMdxFiles(BOOKS_DIR)
    .map(parseBookFile)
    .filter((book) => options.includeDrafts || book.status === "published")
    .sort(compareBooks);
}

export function getFeaturedBooks(limit = 4) {
  const books = getAllBooks();
  const featured = books.filter((book) => book.featured);

  return (featured.length > 0 ? featured : books).slice(0, limit);
}

export function getBookBySlug(slug: string) {
  return getAllBooks().find((book) => book.slug === slug);
}

export function getBookForSeries(seriesName: string) {
  const seriesSlug = slugify(seriesName);

  return getAllBooks().find(
    (book) =>
      book.title === seriesName ||
      slugify(book.title) === seriesSlug ||
      book.aliases.some((alias) => alias === seriesName || slugify(alias) === seriesSlug),
  );
}

export function getBookSearchIndex(): SearchEntry[] {
  return getAllBooks().map((book) => ({
    title: book.title,
    description: book.description,
    url: book.url,
    date: book.date,
    tags: [],
    category: book.category,
    level: book.level,
    articleType: "reference",
    series: "Book",
    content: normalizeSearchText(book.plainText),
  }));
}

export function formatBookAccess(access: BookAccess) {
  return access === "premium" ? "Premium" : "Free";
}

export function parseBookFile(filePath: string): Book {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(/* turbopackIgnore: true */ PROJECT_ROOT, filePath);
  const raw = fs.readFileSync(absolutePath, "utf8");
  const parsed = parseMdxSource(raw);
  const frontmatter = bookFrontmatterSchema.parse(parsed.data);
  const sourcePath = path.relative(PROJECT_ROOT, absolutePath).replaceAll(path.sep, "/");
  const slug = path.basename(absolutePath, path.extname(absolutePath));
  const url = `/books/${slug}`;
  const plainText = stripMarkdown(parsed.content);

  return {
    ...frontmatter,
    categorySlug: slugify(frontmatter.category),
    references: resolveReferences(frontmatter.references),
    slug,
    sourcePath,
    url,
    canonicalUrl: absoluteUrl(url),
    content: parsed.content,
    plainText,
    readingTimeMinutes: estimateReadingTime(parsed.content),
    headings: extractHeadings(parsed.content),
  };
}

function resolveReferences(references: BookFrontmatter["references"]): BookReference[] {
  const articlesBySlug = new Map(getAllArticles().map((article) => [article.slug, article]));

  return references.map((reference) => {
    if (reference.articleSlug) {
      const article = articlesBySlug.get(reference.articleSlug);

      return {
        title: reference.title ?? article?.title ?? reference.articleSlug,
        href: reference.href ?? article?.url ?? `/articles/${reference.articleSlug}`,
        note: reference.note,
        articleSlug: reference.articleSlug,
      };
    }

    return {
      title: reference.title ?? reference.href ?? "Reference",
      href: reference.href ?? "#",
      note: reference.note,
    };
  });
}

function compareBooks(a: Book, b: Book) {
  const domainOrder = compareKnowledgeDomainSlugs(a.categorySlug, b.categorySlug);

  return domainOrder || b.date.localeCompare(a.date) || a.title.localeCompare(b.title);
}
