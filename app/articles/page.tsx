import type { Metadata } from "next";
import { ArticleIndex } from "@/components/article-index";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "記事",
  description: "精査して公開したTech Noteの記事一覧。",
  alternates: {
    canonical: absoluteUrl("/articles"),
  },
};

export default function ArticlesPage() {
  return <ArticleIndex />;
}
