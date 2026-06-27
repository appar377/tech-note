import type { MetadataRoute } from "next";
import { getAllArticles, getCategories, getTags } from "@/lib/articles";
import { getAllBooks } from "@/lib/books";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/books", "/articles", "/categories", "/tags", "/search"].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const articles = getAllArticles().map((article) => ({
    url: article.canonicalUrl,
    lastModified: new Date(article.updated ?? article.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const books = getAllBooks().map((book) => ({
    url: book.canonicalUrl,
    lastModified: new Date(book.updated ?? book.date),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const categories = getCategories().map((category) => ({
    url: absoluteUrl(`/categories/${category.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const tags = getTags().map((tag) => ({
    url: absoluteUrl(`/tags/${tag.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [...staticPages, ...books, ...articles, ...categories, ...tags];
}
