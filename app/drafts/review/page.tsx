import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArticleReader } from "@/components/article-reader";
import { DraftSelection } from "@/components/draft-selection";
import { getReviewArticles } from "@/lib/draft-preview";

export const metadata: Metadata = {
  title: "下書きレビュー",
  robots: { index: false, follow: false },
};

export default function DraftReviewPage() {
  const articles = getReviewArticles();
  if (!articles.length) notFound();
  const entries = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    reader: <ArticleReader article={article} review />,
  }));
  return (
    <Suspense fallback={<p>原稿を読み込んでいます。</p>}>
      <DraftSelection entries={entries} />
    </Suspense>
  );
}
