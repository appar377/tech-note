import type { Article } from "@/lib/articles";
import { withBasePath } from "@/lib/site";

type ArticleThumbnailProps = {
  article: Pick<Article, "title" | "thumbnail">;
  priority?: boolean;
};

export function ArticleThumbnail({ article, priority = false }: ArticleThumbnailProps) {
  if (!article.thumbnail) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath(article.thumbnail)}
        alt={`${article.title} thumbnail`}
        width={1200}
        height={675}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="aspect-video w-full object-cover"
      />
    </div>
  );
}
