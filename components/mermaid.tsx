"use client";

import mermaid, { type MermaidConfig } from "mermaid";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import styles from "./mermaid.module.css";

type MermaidProps = {
  chart?: string;
  encodedChart?: string;
};

type DiagramResult = {
  diagram: string;
  isDark: boolean;
  svg: string;
  error: string;
};

const FONT_FAMILY = 'system-ui, "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif';

// Mermaid shares its configuration across diagrams. Keep initialization and
// rendering together so a queued diagram cannot inherit another theme.
let renderQueue: Promise<void> = Promise.resolve();

export function Mermaid({ chart, encodedChart }: MermaidProps) {
  const reactId = useId();
  const id = `mermaid-${reactId.replaceAll(":", "").replaceAll("_", "")}`;
  const source = readDiagramSource(chart, encodedChart);
  const { diagram } = source;
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => false);
  const [result, setResult] = useState<DiagramResult>();
  const currentResult = result?.diagram === diagram && result.isDark === isDark ? result : undefined;

  useEffect(() => {
    let cancelled = false;

    if (!diagram) {
      return;
    }

    renderQueue = renderQueue.then(async () => {
      if (cancelled) {
        return;
      }

      try {
        mermaid.initialize(diagramConfig(isDark));
        const rendered = await mermaid.render(id, diagram);

        if (!cancelled) {
          setResult({ diagram, isDark, svg: preserveDrawingScale(rendered.svg), error: "" });
        }
      } catch {
        if (!cancelled) {
          setResult({ diagram, isDark, svg: "", error: "図を表示できませんでした。" });
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [diagram, id, isDark]);

  const error = source.error || currentResult?.error;

  if (!diagram || error) {
    return (
      <div className={`not-prose ${styles.status}`} role="status" data-state={error ? "error" : "empty"}>
        <p>{error || "図の定義がありません。"}</p>
        {diagram && (
          <details className={styles.source}>
            <summary>図の定義を確認する</summary>
            <pre>{diagram}</pre>
          </details>
        )}
      </div>
    );
  }

  if (!currentResult) {
    return (
      <p className={`not-prose ${styles.status}`} role="status">
        図を読み込んでいます…
      </p>
    );
  }

  return (
    <figure className={`not-prose ${styles.diagram}`}>
      <div
        className={`reader-diagram ${styles.viewport}`}
        role="region"
        aria-label="本文の図"
        aria-describedby={`${id}-help`}
        tabIndex={0}
        dangerouslySetInnerHTML={{ __html: currentResult.svg }}
      />
      <figcaption id={`${id}-help`} className={styles.hint}>
        図が収まらない場合は、左右にスクロールできます。
      </figcaption>
    </figure>
  );
}

function readDiagramSource(chart?: string, encodedChart?: string) {
  try {
    const rawChart = typeof encodedChart === "string" ? decodeURIComponent(encodedChart) : chart;
    return { diagram: rawChart?.trim() ?? "", error: "" };
  } catch {
    return { diagram: "", error: "図の定義を読み取れませんでした。" };
  }
}

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function diagramConfig(isDark: boolean): MermaidConfig {
  const text = isDark ? "#e4ebe6" : "#202a28";
  const border = isDark ? "#82ab91" : "#739987";
  const background = isDark ? "#1a2320" : "#ffffff";

  return {
    startOnLoad: false,
    securityLevel: "strict",
    suppressErrorRendering: true,
    theme: "base",
    fontFamily: FONT_FAMILY,
    themeVariables: {
      darkMode: isDark,
      background,
      fontFamily: FONT_FAMILY,
      fontSize: "16px",
      primaryColor: isDark ? "#263b30" : "#edf3ee",
      primaryBorderColor: border,
      primaryTextColor: text,
      secondaryColor: isDark ? "#25363d" : "#eef3f6",
      secondaryTextColor: text,
      tertiaryColor: isDark ? "#3a3628" : "#f6f2e6",
      tertiaryTextColor: text,
      textColor: text,
      lineColor: isDark ? "#a5bbae" : "#4e695c",
      edgeLabelBackground: background,
      clusterBkg: background,
      clusterBorder: border,
      noteBkgColor: isDark ? "#343428" : "#f6f2e6",
      noteBorderColor: isDark ? "#c1b786" : "#a5986c",
      noteTextColor: text,
      actorLineColor: border,
    },
    flowchart: { useMaxWidth: false, nodeSpacing: 36, rankSpacing: 52, curve: "linear" },
    sequence: {
      useMaxWidth: false,
      mirrorActors: false,
      actorMargin: 48,
      messageMargin: 34,
      noteMargin: 18,
      actorFontSize: 16,
      messageFontSize: 16,
      noteFontSize: 15,
      wrap: false,
    },
  };
}

function preserveDrawingScale(svg: string) {
  const template = document.createElement("template");
  template.innerHTML = svg;
  const drawing = template.content.querySelector("svg");
  const width = drawing?.viewBox.baseVal.width;

  if (drawing && width && Number.isFinite(width)) {
    drawing.style.width = `${width}px`;
    drawing.style.maxWidth = "none";
    drawing.style.height = "auto";
  }

  return template.innerHTML;
}
