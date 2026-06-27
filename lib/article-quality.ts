import type { Article } from "./articles";

type QualityIssue = {
  article: string;
  message: string;
};

type CategoryRule = {
  requiredHeadings: string[];
  codePattern: RegExp;
  codeLabel: string;
};

export type ArticleQualityReport = {
  errors: QualityIssue[];
  warnings: QualityIssue[];
};

const COMMON_REQUIRED_HEADINGS = [
  "概要",
  "この記事で学べること",
  "前提知識",
  "本編",
  "図解",
  "内部動作",
  "まとめ",
  "参考文献",
];

const MIN_SEO_TEXT_LENGTH = 4000;
const MAX_SEO_TEXT_LENGTH = 8000;

const categoryRules: Record<string, CategoryRule> = {
  database: {
    requiredHeadings: ["SQL例", "EXPLAIN", "実際の性能比較"],
    codePattern: /```[\s\S]*?\bEXPLAIN\b[\s\S]*?```/i,
    codeLabel: "EXPLAINを含むSQLコードブロック",
  },
  sql: {
    requiredHeadings: ["SQL例", "EXPLAIN", "実際の性能比較"],
    codePattern: /```[\s\S]*?\bEXPLAIN\b[\s\S]*?```/i,
    codeLabel: "EXPLAINを含むSQLコードブロック",
  },
  git: {
    requiredHeadings: ["Gitコマンド例"],
    codePattern: /```[\s\S]*?\bgit\s+[a-z][\w-]*[\s\S]*?```/i,
    codeLabel: "gitコマンドを含むコードブロック",
  },
  linux: {
    requiredHeadings: ["CLI・設定例"],
    codePattern: /```(?:bash|sh|shell|text)?[\s\S]*?(?:\$ |# |systemctl|ps |grep|cat |sudo )[\s\S]*?```/i,
    codeLabel: "Linux CLIまたは設定例のコードブロック",
  },
  docker: {
    requiredHeadings: ["CLI・設定例"],
    codePattern: /```(?:bash|sh|shell|dockerfile|yaml|yml|text)?[\s\S]*?(?:docker|FROM |services:)[\s\S]*?```/i,
    codeLabel: "Docker CLIまたは設定例のコードブロック",
  },
  aws: {
    requiredHeadings: ["CLI・設定例"],
    codePattern: /```(?:bash|sh|shell|json|yaml|yml|text)?[\s\S]*?(?:aws |arn:|Resources:)[\s\S]*?```/i,
    codeLabel: "AWS CLIまたは設定例のコードブロック",
  },
  rails: {
    requiredHeadings: ["実装コード例"],
    codePattern: /```(?:ruby|rb|sql|text)?[\s\S]*?(?:class |def |execute|SELECT|INSERT|UPDATE|DELETE)[\s\S]*?```/i,
    codeLabel: "Rails実装またはSQLコードブロック",
  },
  flutter: {
    requiredHeadings: ["実装コード例"],
    codePattern: /```(?:dart|text)?[\s\S]*?(?:Widget|class |build\(|setState|Provider)[\s\S]*?```/i,
    codeLabel: "Flutter実装コードブロック",
  },
  "computer-science": {
    requiredHeadings: ["疑似コード", "計算量"],
    codePattern: /```(?:text|pseudo|ts|js|python)?[\s\S]*?(?:for |while |return|O\()[\s\S]*?```/i,
    codeLabel: "疑似コードまたは計算量を含むコードブロック",
  },
  "next-js": {
    requiredHeadings: ["実装コード例"],
    codePattern: /```(?:ts|tsx|js|jsx|yaml|yml|bash|sh|text)?[\s\S]*?(?:next|output:|basePath|npm run|uses:)[\s\S]*?```/i,
    codeLabel: "Next.js実装または設定コードブロック",
  },
};

export function validateArticleQuality(article: Article): ArticleQualityReport {
  const errors: QualityIssue[] = [];
  const warnings: QualityIssue[] = [];
  const headingTexts = new Set(article.headings.map((heading) => heading.text));
  const requiredHeadings = [
    ...COMMON_REQUIRED_HEADINGS,
    ...(categoryRules[article.categorySlug]?.requiredHeadings ?? []),
  ];

  for (const heading of requiredHeadings) {
    if (!headingTexts.has(heading)) {
      errors.push({
        article: article.sourcePath,
        message: `required heading missing: ${heading}`,
      });
    }
  }

  if (!hasDiagram(article.content)) {
    errors.push({
      article: article.sourcePath,
      message: "diagram is required: add Mermaid, image, SVG, or Canvas content",
    });
  }

  const categoryRule = categoryRules[article.categorySlug];
  if (categoryRule && !categoryRule.codePattern.test(article.content)) {
    errors.push({
      article: article.sourcePath,
      message: `${categoryRule.codeLabel} is required`,
    });
  }

  const textLength = article.plainText.length;
  if (textLength < MIN_SEO_TEXT_LENGTH || textLength > MAX_SEO_TEXT_LENGTH) {
    warnings.push({
      article: article.sourcePath,
      message: `SEO text length guideline is 4,000-8,000 chars; current=${textLength}`,
    });
  }

  return { errors, warnings };
}

export function validateArticlesQuality(articles: Article[]): ArticleQualityReport {
  return articles.reduce<ArticleQualityReport>(
    (report, article) => {
      const result = validateArticleQuality(article);
      report.errors.push(...result.errors);
      report.warnings.push(...result.warnings);
      return report;
    },
    { errors: [], warnings: [] },
  );
}

function hasDiagram(markdown: string) {
  return /```mermaid\b/i.test(markdown) || /!\[[^\]]*]\([^)]*\)/.test(markdown) || /<\s*(?:Mermaid|img|svg|canvas)\b/i.test(markdown) || /\.svg\b/i.test(markdown);
}
