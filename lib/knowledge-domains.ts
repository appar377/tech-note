import { slugify } from "./slug";

export type KnowledgeDomain = {
  name: string;
  slug: string;
  description: string;
};

export const KNOWLEDGE_DOMAINS = [
  {
    name: "Git",
    slug: "git",
    description: "Object、merge、rebaseなど、Gitの内部構造から理解する。",
  },
  {
    name: "SQL",
    slug: "sql",
    description: "SQL構文、関数、問い合わせの書き方を実例から整理する。",
  },
  {
    name: "Database",
    slug: "database",
    description: "Optimizer、Index、MVCC、Storage EngineなどDB内部動作を学ぶ。",
  },
  {
    name: "Linux",
    slug: "linux",
    description: "プロセス、メモリ、ファイルシステム、シグナルを内部から理解する。",
  },
  {
    name: "Docker",
    slug: "docker",
    description: "Namespace、cgroup、OverlayFSなどコンテナの仕組みを整理する。",
  },
  {
    name: "AWS",
    slug: "aws",
    description: "VPC、IAM、Route53、ロードバランサなどクラウド基盤を体系化する。",
  },
  {
    name: "Architecture",
    slug: "architecture",
    description: "認証、認可、分散設計、セキュリティ境界など設計上の判断を整理する。",
  },
  {
    name: "File Formats",
    slug: "file-formats",
    description: "拡張子、ファイル形式、用途、扱うツール、注意点を図鑑のように整理する。",
  },
  {
    name: "Rails",
    slug: "rails",
    description: "ActiveRecord、Rack、ZeitwerkなどRailsの内部と実務パターンを扱う。",
  },
  {
    name: "Flutter",
    slug: "flutter",
    description: "Widget、Rendering、State管理などFlutterの構造を整理する。",
  },
  {
    name: "Computer Science",
    slug: "computer-science",
    description: "データ構造、アルゴリズム、CPU、メモリ、計算量を体系的に学ぶ。",
  },
  {
    name: "Next.js",
    slug: "next-js",
    description: "App Router、SSG、デプロイなどTech Note運用に必要なNext.js知識。",
  },
] as const satisfies KnowledgeDomain[];

const domainOrder: Map<string, number> = new Map(
  KNOWLEDGE_DOMAINS.map((domain, index) => [domain.slug, index]),
);
const domainBySlug: Map<string, KnowledgeDomain> = new Map(
  KNOWLEDGE_DOMAINS.map((domain) => [domain.slug, domain]),
);

export function getKnowledgeDomain(nameOrSlug: string) {
  return domainBySlug.get(slugify(nameOrSlug));
}

export function compareKnowledgeDomainSlugs(a: string, b: string) {
  const aOrder = domainOrder.get(slugify(a)) ?? Number.MAX_SAFE_INTEGER;
  const bOrder = domainOrder.get(slugify(b)) ?? Number.MAX_SAFE_INTEGER;

  return aOrder - bOrder || a.localeCompare(b);
}
