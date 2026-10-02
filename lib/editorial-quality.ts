import type { Article } from "./articles";
import type { ArticleQualityReport } from "./article-quality";

// Opt-in only. test/editorial-review.test.ts requires evidence bound to the exact
// article and cover hashes. Source authority and accuracy still need human review.
export function validateQuestionLedArticle(
  article: Article,
): ArticleQualityReport {
  const errors: ArticleQualityReport["errors"] = [];
  const warnings: ArticleQualityReport["warnings"] = [];
  const addError = (message: string) =>
    errors.push({ article: article.sourcePath, message });
  const codeBlocks = [
    ...article.content.matchAll(/^```([^\n]*)\n([\s\S]*?)^```\s*$/gm),
  ];
  const prose = article.content.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, "");

  if (!prose.trim()) addError("Article needs an explanation, not only code.");
  if (!/\[[^\]]+\]\(https:\/\/[^\s)]+\)/.test(prose))
    addError("Link a source next to the claim it supports.");
  if ((article.content.match(/^```/gm)?.length ?? 0) !== codeBlocks.length * 2)
    addError("Close every fenced code block.");
  if (/\b(?:TODO|FIXME|TestSubject)\b/.test(article.content))
    addError("Resolve placeholders before editorial review.");
  if (/当初は、API名やメソッド名から直感的|症状を観測する[\s\S]*誤解を切り分ける/.test(article.content))
    addError("Replace generic experience or diagram templates with sourced explanations.");
  if (article.headings.length === 0)
    addError("Add descriptive headings so readers can find the explanation.");
  if (
    article.articleType === "practical" &&
    !codeBlocks.some((match) => !/^(text|json|mermaid)?$/.test(match[1].trim()))
  )
    addError(
      "Practical articles need a concrete command or implementation example.",
    );
  if (/`[^`\n]*(?:&lt;|&gt;)[^`\n]*`/.test(prose))
    addError("Do not double-escape angle brackets inside inline code.");
  if (article.plainText.length > 8000)
    warnings.push({
      article: article.sourcePath,
      message:
        "Review whether this scope is better split; no mandatory word count.",
    });
  return { errors, warnings };
}
