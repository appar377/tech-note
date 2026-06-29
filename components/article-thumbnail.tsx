import type { Article } from "@/lib/articles";
import { withBasePath } from "@/lib/site";

type ArticleThumbnailProps = {
  article: Pick<Article, "title" | "thumbnail">;
  priority?: boolean;
  framed?: boolean;
};

export function ArticleThumbnail({
  article,
  priority = false,
  framed = true,
}: ArticleThumbnailProps) {
  if (!article.thumbnail) {
    return null;
  }

  return (
    <div
      className={
        framed
          ? "tech-thumbnail aspect-video w-full overflow-hidden rounded-lg border"
          : "tech-thumbnail aspect-video w-full overflow-hidden"
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath(article.thumbnail)}
        alt={`${article.title} thumbnail`}
        width={1200}
        height={675}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="block h-full w-full object-cover"
      />
    </div>
  );
}
