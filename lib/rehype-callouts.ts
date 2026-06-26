import type { Element, Root, Text } from "hast";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

const CALLOUT_TYPES = new Set(["NOTE", "TIP", "WARNING", "IMPORTANT", "INFO"]);

export function rehypeCallouts() {
  return function transformer(tree: Root) {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "blockquote") {
        return;
      }

      const firstParagraph = node.children?.find(
        (child) => child.type === "element" && child.tagName === "p",
      ) as Element | undefined;

      if (!firstParagraph) {
        return;
      }

      const firstText = firstParagraph?.children?.find((child) => child.type === "text") as
        | Text
        | undefined;
      const marker = toString(firstParagraph).match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|INFO)\]/i);

      if (!firstText?.value || !marker) {
        return;
      }

      const type = marker[1].toUpperCase();
      if (!CALLOUT_TYPES.has(type)) {
        return;
      }

      firstText.value = firstText.value.replace(/^\[![^\]]+]\s*/i, "");
      node.properties = {
        ...(node.properties ?? {}),
        className: ["callout", `callout-${type.toLowerCase()}`],
        "data-callout": type.toLowerCase(),
      };
    });
  };
}
