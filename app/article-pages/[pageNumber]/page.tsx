import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleIndex, ARTICLES_PER_PAGE } from "@/components/article-index";
import { getAllArticles, paginateArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ pageNumber: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const totalPages = Math.ceil(getAllArticles().length / ARTICLES_PER_PAGE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    pageNumber: String(index + 2),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pageNumber } = await params;
  return {
    title: `Articles - Page ${pageNumber}`,
    description: `Tech Noteの記事一覧 ${pageNumber}ページ目。`,
    alternates: {
      canonical: absoluteUrl(`/article-pages/${pageNumber}`),
    },
  };
}

export default async function ArticlesPaginatedPage({ params }: PageProps) {
  const { pageNumber } = await params;
  const page = Number(pageNumber);
  const paginated = paginateArticles(getAllArticles(), page, ARTICLES_PER_PAGE);

  if (!Number.isInteger(page) || page < 2 || page > paginated.totalPages) {
    notFound();
  }

  return <ArticleIndex page={page} />;
}
