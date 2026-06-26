"use client";

import mermaid from "mermaid";
import { useEffect, useId, useState } from "react";

type MermaidProps = {
  chart: string;
};

export function Mermaid({ chart }: MermaidProps) {
  const reactId = useId();
  const id = `mermaid-${reactId.replaceAll(":", "").replaceAll("_", "")}`;
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: document.documentElement.classList.contains("dark") ? "dark" : "neutral",
    });

    mermaid
      .render(id, chart)
      .then((result) => {
        if (!cancelled) {
          setSvg(result.svg);
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
  }, [chart, id]);

  if (error) {
    return (
      <pre className="not-prose overflow-x-auto rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-950 dark:bg-red-950/30 dark:text-red-200">
        {error}
      </pre>
    );
  }

  return (
    <div
      className="not-prose my-8 overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
