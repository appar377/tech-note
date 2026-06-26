import { ExternalLink, Share2 } from "lucide-react";

export function ShareLinks({
  title,
  url,
  editUrl,
}: {
  title: string;
  url: string;
  editUrl: string;
}) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        className="icon-button"
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Xで共有"
        title="Xで共有"
      >
        <Share2 aria-hidden size={17} />
      </a>
      <a
        className="icon-button"
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedInで共有"
        title="LinkedInで共有"
      >
        <Share2 aria-hidden size={17} />
      </a>
      <a
        className="icon-text-button"
        href={editUrl}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalLink aria-hidden size={17} />
        GitHubで編集
      </a>
    </div>
  );
}
