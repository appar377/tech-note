"use client";

import mermaid from "mermaid";
import { useEffect, useId, useState } from "react";

type MermaidProps = {
  chart?: string;
  encodedChart?: string;
};

export function Mermaid({ chart, encodedChart }: MermaidProps) {
  const reactId = useId();
  const id = `mermaid-${reactId.replaceAll(":", "").replaceAll("_", "")}`;
  const rawChart = typeof encodedChart === "string" ? decodeURIComponent(encodedChart) : chart;
  const diagram = typeof rawChart === "string" ? rawChart.trim() : "";
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!diagram) {
      return () => {
        cancelled = true;
      };
    }

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: document.documentElement.classList.contains("dark") ? "dark" : "neutral",
    });

    mermaid
      .render(id, diagram)
      .then((result) => {
        if (!cancelled) {
          // Preserve Mermaid's drawing scale so mobile labels stay readable.
          // The surrounding region scrolls instead of shrinking the whole SVG.
          const template = document.createElement("template");
          template.innerHTML = result.svg;
          const drawing = template.content.querySelector("svg");
          const width = drawing?.viewBox.baseVal.width;
          if (drawing && width && Number.isFinite(width)) {
            drawing.style.width = `${width}px`;
            drawing.style.maxWidth = "none";
            drawing.style.height = "auto";
          }
          setSvg(template.innerHTML);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : "Mermaid diagram failed to render.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [diagram, id]);

  if (!diagram || error) {
    return (
      <pre className="not-prose overflow-x-auto rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-950 dark:bg-red-950/30 dark:text-red-200">
        {error || "Mermaid diagram source is empty."}
      </pre>
    );
  }

  return (
    <div
      className="reader-diagram not-prose my-8 overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
      role="region"
      aria-label="本文の図（左右にスクロールできます）"
      tabIndex={0}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
