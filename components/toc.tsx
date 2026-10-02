import type { TableOfContentsItem } from "@/lib/articles";

export function TableOfContents({
  headings,
}: {
  headings: TableOfContentsItem[];
}) {
  if (!headings.length) return null;
  return (
    <details className="reader-toc" open>
      <summary>このページの内容</summary>
      <nav aria-label="目次">
        <ol>
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{
                paddingLeft: `${Math.max(0, heading.depth - 2) * 12}px`,
              }}
            >
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
