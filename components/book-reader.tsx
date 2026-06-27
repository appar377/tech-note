"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Minimize2 } from "lucide-react";
import type { TableOfContentsItem } from "@/lib/articles";

type BookReaderProps = {
  chapters: TableOfContentsItem[];
  children: ReactNode;
};

export function BookReader({ chapters, children }: BookReaderProps) {
  const chapterList = useMemo(() => chapters.filter((chapter) => chapter.depth === 2), [chapters]);
  const [activeId, setActiveId] = useState(chapterList[0]?.id ?? "");
  const [focusMode, setFocusMode] = useState(false);
  const activeIndex = Math.max(
    0,
    chapterList.findIndex((chapter) => chapter.id === activeId),
  );
  const activeChapter = chapterList[activeIndex];
  const progress =
    chapterList.length <= 1 ? 100 : Math.round(((activeIndex + 1) / chapterList.length) * 100);

  const goToChapter = useCallback(
    (index: number) => {
      const nextChapter = chapterList[index];
      if (!nextChapter) return;

      setActiveId(nextChapter.id);
      document.getElementById(nextChapter.id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [chapterList],
  );

  useEffect(() => {
    if (chapterList.length === 0) return;

    const elements = chapterList
      .map((chapter) => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [chapterList]);

  useEffect(() => {
    if (!focusMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToChapter(activeIndex + 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToChapter(activeIndex - 1);
      }

      if (event.key === "Escape") {
        setFocusMode(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, focusMode, goToChapter]);

  return (
    <section className={focusMode ? "book-reader book-reader--focus" : "book-reader"}>
      <div className="book-reader__toolbar" aria-label="Book reader controls">
        <div className="min-w-0">
          <span className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
            Chapter
          </span>
          <p className="mt-1 truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {activeChapter?.text ?? "Start"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="book-reader__button"
            onClick={() => goToChapter(activeIndex - 1)}
            disabled={activeIndex <= 0}
            aria-label="前の章へ移動"
          >
            <ChevronLeft aria-hidden size={17} />
          </button>
          <button
            type="button"
            className="book-reader__button"
            onClick={() => goToChapter(activeIndex + 1)}
            disabled={activeIndex >= chapterList.length - 1}
            aria-label="次の章へ移動"
          >
            <ChevronRight aria-hidden size={17} />
          </button>
          <button
            type="button"
            className="book-reader__mode"
            onClick={() => setFocusMode((current) => !current)}
            aria-pressed={focusMode}
          >
            {focusMode ? <Minimize2 aria-hidden size={15} /> : <Expand aria-hidden size={15} />}
            {focusMode ? "通常表示" : "読書モード"}
          </button>
        </div>
      </div>

      <div className="book-reader__progress" aria-hidden>
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="book-page-shell">
        <span className="book-page-shell__spine" aria-hidden />
        <div className="book-page">{children}</div>
      </div>

      <nav className="book-reader__footer" aria-label="Chapter pagination">
        <button
          type="button"
          className="book-reader__pager"
          onClick={() => goToChapter(activeIndex - 1)}
          disabled={activeIndex <= 0}
        >
          <ChevronLeft aria-hidden size={17} />
          <span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-500">Previous</span>
            <span className="block truncate font-medium">
              {chapterList[activeIndex - 1]?.text ?? "先頭"}
            </span>
          </span>
        </button>
        <button
          type="button"
          className="book-reader__pager book-reader__pager--next"
          onClick={() => goToChapter(activeIndex + 1)}
          disabled={activeIndex >= chapterList.length - 1}
        >
          <span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-500">Next</span>
            <span className="block truncate font-medium">
              {chapterList[activeIndex + 1]?.text ?? "最後"}
            </span>
          </span>
          <ChevronRight aria-hidden size={17} />
        </button>
      </nav>
    </section>
  );
}
