import type { ComponentPropsWithoutRef } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "@/components/code-block";
import { Mermaid } from "@/components/mermaid";
import {
  Accordion,
  BlueUnderline,
  Notebook,
  RedUnderline,
  StickyNote,
  Video,
  YouTube,
} from "@/components/mdx-widgets";
import { rehypeCallouts } from "@/lib/rehype-callouts";
import { rehypeBookPages } from "@/lib/book-pages";
import { withBasePath } from "@/lib/site";

type MdxContentProps = {
  source: string;
  variant?: "default" | "notebook";
  paginateBook?: boolean;
};

export async function MdxContent({
  source,
  variant = "default",
  paginateBook = false,
}: MdxContentProps) {
  const transformedSource = transformMermaidFences(source);
  const { content } = await compileMDX({
    source: transformedSource,
    components: variant === "notebook" ? notebookComponents : components,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: ["heading-anchor"],
                ariaLabel: "見出しへのリンク",
              },
              content: {
                type: "text",
                value: "#",
              },
            },
          ],
          rehypeKatex,
          [
            rehypePrettyCode,
            {
              theme: {
                light: "github-light",
                dark: "github-dark",
              },
              keepBackground: false,
            },
          ],
          rehypeCallouts,
          ...(paginateBook ? [rehypeBookPages] : []),
        ],
      },
    },
  });

  return <>{content}</>;
}

const components = {
  pre: CodeBlock,
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const external = href?.startsWith("http://") || href?.startsWith("https://");
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ({ src = "", alt = "", ...props }: ComponentPropsWithoutRef<"img">) => {
    const imageSrc = typeof src === "string" ? withBasePath(src) : "";

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageSrc} alt={alt} loading="lazy" {...props} />
    );
  },
  Mermaid,
  YouTube,
  Video,
  Accordion,
  Notebook,
  StickyNote,
  RedUnderline,
  BlueUnderline,
};

const notebookComponents = {
  ...components,
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <CodeBlock tabIndex={0} {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <table tabIndex={0} {...props} />
  ),
};

function transformMermaidFences(source: string) {
  return source.replace(/```mermaid\n([\s\S]*?)```/g, (_match, chart: string) => {
    return `<Mermaid encodedChart="${encodeURIComponent(chart.trim())}" />`;
  });
}
