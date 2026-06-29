import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { z } from "zod";
import type { ArticleLevel, ArticleType } from "./article-metadata";
import { compareKnowledgeDomainSlugs, getKnowledgeDomain } from "./knowledge-domains";
import { listMdxFiles, parseMdxSource } from "./mdx-source";
import { getSeriesBookDefinition, type SeriesBookDefinition } from "./series-books";
import { absoluteUrl } from "./site";
import { normalizeSearchText, slugify, titleFromSlug } from "./slug";

const PROJECT_ROOT = /* turbopackIgnore: true */ process.cwd();
const ARTICLES_DIR = path.join(/* turbopackIgnore: true */ PROJECT_ROOT, "articles");
const ARTICLE_EXTENSION = ".mdx";
const WORDS_PER_MINUTE = 220;
const CJK_CHARS_PER_MINUTE = 500;

const seriesSchema = z.union([
  z.string(),
  z.object({
    name: z.string().min(1),
    slug: z.string().min(1).optional(),
    order: z.number().int().positive().optional(),
  }),
]);

const dateStringSchema = z.preprocess((value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value;
}, z.string().min(1));

const articleLevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
const articleTypeSchema = z.enum(["internal", "practical", "reference"]);

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: dateStringSchema,
  updated: dateStringSchema.optional(),
  tags: z.array(z.string().min(1)).default([]),
  category: z.string().min(1),
  level: articleLevelSchema,
  articleType: articleTypeSchema,
  series: seriesSchema.optional(),
  draft: z.boolean().default(false),
  thumbnail: z.string().optional(),
  popular: z.boolean().default(false),
});

export type ArticleFrontmatter = z.infer<typeof frontmatterSchema>;

export type Article = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  category: string;
  categorySlug: string;
  level: ArticleLevel;
  articleType: ArticleType;
  series?: {
    name: string;
    slug: string;
    order?: number;
  };
  draft: boolean;
  thumbnail?: string;
  popular: boolean;
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

export type TableOfContentsItem = {
  id: string;
  text: string;
  depth: number;
};

export type TaxonomyItem = {
  name: string;
  slug: string;
  count: number;
  description?: string;
};

export type SeriesItem = TaxonomyItem & {
  description: string;
  category: string;
  categorySlug: string;
  subtitle: string;
  goal: string;
  audience: string[];
  prerequisites: string[];
  outcomes: string[];
  concept: string;
  sections: SeriesSection[];
  notes: SeriesBookDefinition["notes"];
  references: SeriesBookDefinition["references"];
  articles: Article[];
};

export type SeriesSection = {
  title: string;
  description: string;
  articles: Article[];
};

export type SearchEntry = {
  title: string;
  description: string;
  url: string;
  date: string;
  tags: string[];
  category: string;
  level: ArticleLevel;
  articleType: ArticleType;
  series?: string;
  content: string;
};

export function getAllArticles(options: { includeDrafts?: boolean } = {}) {
  const articles = listMdxFiles(ARTICLES_DIR)
    .map(parseArticleFile)
    .filter((article) => options.includeDrafts || !article.draft)
    .sort(compareArticlesDesc);

  return articles;
}

export function getArticleBySlug(slugSegments: string[]) {
  const slug = slugSegments.join("/");
  return getAllArticles().find((article) => article.slug === slug);
}

export function getAdjacentArticles(article: Article) {
  const articles = getAllArticles().sort(compareArticlesAsc);
  const currentIndex = articles.findIndex((item) => item.slug === article.slug);

  return {
    previous: currentIndex > 0 ? articles[currentIndex - 1] : undefined,
    next:
      currentIndex >= 0 && currentIndex < articles.length - 1
        ? articles[currentIndex + 1]
        : undefined,
  };
}

export function getRelatedArticles(article: Article, limit = 4) {
  return getAllArticles()
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => ({
      article: candidate,
      score: relatedScore(article, candidate),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || compareArticlesDesc(a.article, b.article))
    .slice(0, limit)
    .map((item) => item.article);
}

export function getCategories(): TaxonomyItem[] {
  return countBy(
    getAllArticles().map((article) => ({
      name: article.category,
      slug: article.categorySlug,
    })),
  )
    .map((category) => ({
      ...category,
      description: getKnowledgeDomain(category.slug)?.description,
    }))
    .sort(
      (a, b) =>
        compareKnowledgeDomainSlugs(a.slug, b.slug) ||
        b.count - a.count ||
        a.name.localeCompare(b.name),
    );
}

export function getTags(): TaxonomyItem[] {
  return countBy(
    getAllArticles().flatMap((article) =>
      article.tags.map((tag) => ({
        name: tag,
        slug: slugify(tag),
      })),
    ),
  );
}

export function getSeries(): SeriesItem[] {
  const groups = new Map<string, SeriesItem>();

  for (const article of getAllArticles()) {
    if (!article.series) {
      continue;
    }

    const current = groups.get(article.series.slug) ?? {
      name: article.series.name,
      slug: article.series.slug,
      category: article.category,
      categorySlug: article.categorySlug,
      description: "",
      subtitle: "",
      goal: "",
      audience: [],
      prerequisites: [],
      outcomes: [],
      concept: "",
      sections: [],
      notes: [],
      references: [],
      count: 0,
      articles: [],
    };

    current.count += 1;
    current.articles.push(article);
    groups.set(article.series.slug, current);
  }

  return Array.from(groups.values())
    .map((series) => buildSeriesItem(series))
    .sort(
      (a, b) =>
        compareKnowledgeDomainSlugs(a.categorySlug, b.categorySlug) ||
        a.name.localeCompare(b.name),
    );
}

export function getArticlesByCategory(categorySlug: string) {
  return getAllArticles().filter((article) => article.categorySlug === categorySlug);
}

export function getArticlesByTag(tagSlug: string) {
  return getAllArticles().filter((article) =>
    article.tags.some((tag) => slugify(tag) === tagSlug),
  );
}

export function getArticlesBySeries(seriesSlug: string) {
  const series = getSeries().find((item) => item.slug === seriesSlug);
  return series?.articles ?? [];
}

export function getSearchIndex(): SearchEntry[] {
  return getAllArticles().map((article) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    date: article.date,
    tags: article.tags,
    category: article.category,
    level: article.level,
    articleType: article.articleType,
    series: article.series?.name,
    content: normalizeSearchText(article.plainText),
  }));
}

export function paginateArticles(articles: Article[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(articles.length / perPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * perPage;

  return {
    articles: articles.slice(start, start + perPage),
    currentPage,
    totalPages,
  };
}

export function extractHeadings(markdown: string): TableOfContentsItem[] {
  const slugger = new GithubSlugger();
  const headings: TableOfContentsItem[] = [];
  let inCodeBlock = false;

  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const match = /^(#{2,4})\s+(.+)$/.exec(line.trim());
    if (!match) {
      continue;
    }

    const text = stripInlineMarkdown(match[2]);
    headings.push({
      id: slugger.slug(text),
      text,
      depth: match[1].length,
    });
  }

  return headings;
}

export function estimateReadingTime(markdown: string) {
  const text = stripMarkdown(markdown);
  const cjkCount = (text.match(/[\u3040-\u30ff\u3400-\u9fff]/g) ?? []).length;
  const wordCount = (text.replace(/[\u3040-\u30ff\u3400-\u9fff]/g, " ").match(/\b[\w-]+\b/g) ?? [])
    .length;

  return Math.max(
    1,
    Math.ceil(wordCount / WORDS_PER_MINUTE + cjkCount / CJK_CHARS_PER_MINUTE),
  );
}

export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseArticleFile(filePath: string): Article {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(/* turbopackIgnore: true */ PROJECT_ROOT, filePath);
  const raw = fs.readFileSync(absolutePath, "utf8");
  const parsed = parseMdxSource(raw);
  const frontmatter = frontmatterSchema.parse(parsed.data);
  const sourcePath = path.relative(PROJECT_ROOT, absolutePath).replaceAll(path.sep, "/");
  const slugSegments = path
    .relative(ARTICLES_DIR, absolutePath)
    .replaceAll(path.sep, "/")
    .replace(new RegExp(`${ARTICLE_EXTENSION}$`), "")
    .split("/");
  const slug = slugSegments.join("/");
  const categorySlug = slugify(frontmatter.category);
  const series = normalizeSeries(frontmatter.series);
  const plainText = stripMarkdown(parsed.content);
  const url = `/articles/${slug}`;

  return {
    ...frontmatter,
    series,
    categorySlug,
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

function compareArticlesDesc(a: Article, b: Article) {
  return getSortableDate(b).localeCompare(getSortableDate(a)) || a.title.localeCompare(b.title);
}

function compareArticlesAsc(a: Article, b: Article) {
  return getSortableDate(a).localeCompare(getSortableDate(b)) || a.title.localeCompare(b.title);
}

function getSortableDate(article: Article) {
  return article.updated ?? article.date;
}

function normalizeSeries(series: ArticleFrontmatter["series"]): Article["series"] {
  if (!series) {
    return undefined;
  }

  const name = typeof series === "string" ? series : series.name;
  const slug = typeof series === "string" ? slugify(name) : (series.slug ?? slugify(name));
  const order = typeof series === "string" ? undefined : series.order;

  return {
    name,
    slug,
    order,
  };
}

function relatedScore(source: Article, candidate: Article) {
  let score = 0;

  if (source.categorySlug === candidate.categorySlug) {
    score += 35;
  }

  if (source.series?.slug && source.series.slug === candidate.series?.slug) {
    score += 50;
  }

  const sourceTagSlugs = new Set(source.tags.map(slugify));
  for (const tag of candidate.tags) {
    if (sourceTagSlugs.has(slugify(tag))) {
      score += 15;
    }
  }

  return score;
}

function countBy(items: Array<{ name: string; slug: string }>) {
  const counts = new Map<string, TaxonomyItem>();

  for (const item of items) {
    const current = counts.get(item.slug) ?? { name: item.name, slug: item.slug, count: 0 };
    current.count += 1;
    counts.set(item.slug, current);
  }

  return Array.from(counts.values()).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

function sortSeriesArticles(articles: Article[]) {
  return [...articles].sort((a, b) => {
    const aOrder = a.series?.order ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.series?.order ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder || compareArticlesAsc(a, b);
  });
}

function buildSeriesItem(series: SeriesItem): SeriesItem {
  const definition = getSeriesBookDefinition(series.slug);
  const articles = sortSeriesArticles(series.articles);
  const name = definition?.name ?? series.name;
  const category = definition?.category ?? series.category;
  const categorySlug = definition?.categorySlug ?? series.categorySlug;

  return {
    ...series,
    name,
    category,
    categorySlug,
    description:
      definition?.description ??
      `${name}に関連する公開済み記事を、学習しやすい順番でまとめたシリーズです。`,
    subtitle: definition?.subtitle ?? "公開済みの記事を、章立てとして順番に辿るシリーズ。",
    goal:
      definition?.goal ??
      `${name}の主要な考え方を、記事を順番に読みながら説明できる状態を目指します。`,
    audience: definition?.audience ?? [],
    prerequisites: definition?.prerequisites ?? [],
    outcomes: definition?.outcomes ?? [],
    concept: definition?.concept ?? "",
    sections: buildSeriesSections(definition, articles, name),
    notes: definition?.notes ?? [],
    references: definition?.references ?? [],
    articles,
  };
}

function buildSeriesSections(
  definition: SeriesBookDefinition | undefined,
  articles: Article[],
  seriesName: string,
): SeriesSection[] {
  if (!definition) {
    return [
      {
        title: "公開済みの章",
        description: `${seriesName}の公開済み記事です。`,
        articles,
      },
    ];
  }

  const articlesBySlug = new Map(articles.map((article) => [article.slug, article]));
  const usedArticleSlugs = new Set<string>();
  const sections = definition.sections
    .map((section) => {
      const sectionArticles = section.articleSlugs.flatMap((slug) => {
        const article = articlesBySlug.get(slug);

        if (!article) {
          return [];
        }

        usedArticleSlugs.add(article.slug);
        return [article];
      });

      return {
        title: section.title,
        description: section.description,
        articles: sectionArticles,
      };
    })
    .filter((section) => section.articles.length > 0);

  const remainingArticles = articles.filter((article) => !usedArticleSlugs.has(article.slug));
  if (remainingArticles.length > 0) {
    sections.push({
      title: "補足章",
      description: "シリーズ定義にまだ分類していない公開済み記事です。",
      articles: remainingArticles,
    });
  }

  return sections.length > 0
    ? sections
    : [
        {
          title: "公開済みの章",
          description: `${seriesName}の公開済み記事です。`,
          articles,
        },
      ];
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[*_~]/g, "")
    .trim();
}

export function displaySegment(segment: string) {
  return titleFromSlug(segment);
}
