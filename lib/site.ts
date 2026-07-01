export const SITE_NAME = "Tech Note";
export const SITE_DESCRIPTION =
  "技術記事、Book、雑記メモ、読書記録を育てるポートフォリオ兼ラーニングライブラリ。";
export const SITE_URL = "https://appar377.github.io/tech-note";
export const BASE_PATH = "/tech-note";
export const GITHUB_REPO_URL = "https://github.com/appar377/tech-note";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function withBasePath(path: string) {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === BASE_PATH || normalizedPath.startsWith(`${BASE_PATH}/`)) {
    return normalizedPath;
  }

  return `${BASE_PATH}${normalizedPath}`;
}
