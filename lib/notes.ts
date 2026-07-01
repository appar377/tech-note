import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  estimateReadingTime,
  extractHeadings,
  stripMarkdown,
  type SearchEntry,
  type TableOfContentsItem,
} from "./articles";
import { listMdxFiles, parseMdxSource } from "./mdx-source";
import { absoluteUrl } from "./site";
import { normalizeSearchText, slugify } from "./slug";

const PROJECT_ROOT = /* turbopackIgnore: true */ process.cwd();
const NOTES_DIR = path.join(/* turbopackIgnore: true */ PROJECT_ROOT, "notes");
const NOTE_EXTENSION = ".mdx";

const dateStringSchema = z.preprocess((value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value;
}, z.string().min(1));

const noteFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: dateStringSchema,
  updated: dateStringSchema.optional(),
  tags: z.array(z.string().min(1)).default([]),
  area: z.string().min(1).default("Learning"),
  status: z.enum(["rough", "refined"]).default("rough"),
  source: z.enum(["ai-dialogue", "manual", "reading", "learning"]).default("manual"),
  draft: z.boolean().default(false),
  thumbnail: z.string().optional(),
});

export type NoteFrontmatter = z.infer<typeof noteFrontmatterSchema>;

export type Note = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  area: string;
  areaSlug: string;
  status: "rough" | "refined";
  source: "ai-dialogue" | "manual" | "reading" | "learning";
  draft: boolean;
  thumbnail?: string;
  slug: string;
  slugSegments: string[];
  sourcePath: string;
  url: string;
  canonicalUrl: string;
  content: string;
  plainText: string;
  readingTimeMinutes: number;
  headings: TableOfContentsItem[];
};

export function getAllNotes(options: { includeDrafts?: boolean } = {}) {
  return listMdxFiles(NOTES_DIR)
    .map(parseNoteFile)
    .filter((note) => options.includeDrafts || !note.draft)
    .sort(compareNotesDesc);
}

export function getNoteBySlug(slugSegments: string[]) {
  const slug = slugSegments.join("/");
  return getAllNotes().find((note) => note.slug === slug);
}

export function getNoteSearchIndex(): SearchEntry[] {
  return getAllNotes().map((note) => ({
    title: note.title,
    description: note.description,
    url: note.url,
    date: note.date,
    tags: note.tags,
    category: note.area,
    level: 1,
    articleType: "reference",
    series: note.status === "rough" ? "Daily Note" : "Refined Note",
    content: normalizeSearchText(note.plainText),
  }));
}

export function parseNoteFile(filePath: string): Note {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(/* turbopackIgnore: true */ PROJECT_ROOT, filePath);
  const raw = fs.readFileSync(absolutePath, "utf8");
  const parsed = parseMdxSource(raw);
  const frontmatter = noteFrontmatterSchema.parse(parsed.data);
  const sourcePath = path.relative(PROJECT_ROOT, absolutePath).replaceAll(path.sep, "/");
  const slugSegments = path
    .relative(NOTES_DIR, absolutePath)
    .replaceAll(path.sep, "/")
    .replace(new RegExp(`${NOTE_EXTENSION}$`), "")
    .split("/");
  const slug = slugSegments.join("/");
  const url = `/notes/${slug}`;
  const plainText = stripMarkdown(parsed.content);

  return {
    ...frontmatter,
    areaSlug: slugify(frontmatter.area),
    slug,
    slugSegments,
    sourcePath,
    url,
    canonicalUrl: absoluteUrl(url),
    content: parsed.content,
    plainText,
    readingTimeMinutes: estimateReadingTime(parsed.content),
    headings: extractHeadings(parsed.content),
  };
}

function compareNotesDesc(a: Note, b: Note) {
  return getSortableDate(b).localeCompare(getSortableDate(a)) || a.title.localeCompare(b.title);
}

function getSortableDate(note: Note) {
  return note.updated ?? note.date;
}
