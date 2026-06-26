import type { Metadata } from "next";
import { ArticleIndex } from "@/components/article-index";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Articles",
  description: "Tech Noteの記事一覧。",
  alternates: {
    canonical: absoluteUrl("/articles"),
  },
};

export default function ArticlesPage() {
  return <ArticleIndex />;
}
