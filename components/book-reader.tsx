"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const readerRef = useRef<HTMLElement>(null);
  const pendingPosition = useRef<{ element: HTMLElement; offset: number } | null>(null);
  const activeIndex = Math.max(
    0,
    chapterList.findIndex((chapter) => chapter.id === activeId),
  );
  const activeChapter = chapterList[activeIndex];
  const progress =
    chapterList.length <= 1 ? 100 : Math.round(((activeIndex + 1) / chapterList.length) * 100);

  const changeReadingMode = useCallback((enabled: boolean) => {
    const reader = readerRef.current;
    const boundary = reader?.querySelector(".book-reader__toolbar")
      ?.getBoundingClientRect().bottom ?? 0;
    const element = document.getElementById(activeId);
    if (element) {
      pendingPosition.current = {
        element,
        offset: element.getBoundingClientRect().top - boundary,
      };
    }
    setFocusMode(enabled);
  }, [activeId]);

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

    const reader = readerRef.current;
    if (!reader) return;
    const scrollTarget = focusMode ? reader : window;
    let frame = 0;

    const updateActiveChapter = () => {
      frame = 0;
      const toolbarBottom = reader.querySelector(".book-reader__toolbar")
        ?.getBoundingClientRect().bottom ?? 0;
      const chapterOffset = Number.parseFloat(getComputedStyle(elements[0]).scrollMarginTop) || 0;
      const threshold = Math.max(toolbarBottom + 48, chapterOffset + 1);
      let current = elements[0];
      for (const element of elements) {
        // Retained bookmarks sit immediately before the renamed chapter heading.
        let start = element;
        while (
          start.previousElementSibling instanceof HTMLElement &&
          start.previousElementSibling.matches("span[id]:empty")
        ) {
          start = start.previousElementSibling;
        }
        if (start.getBoundingClientRect().top > threshold) break;
        current = element;
      }
      setActiveId(current.id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateActiveChapter);
    };

    frame = requestAnimationFrame(updateActiveChapter);
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      scrollTarget.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [chapterList, focusMode]);

  useEffect(() => {
    document.body.classList.toggle("book-reading-mode", focusMode);

    return () => {
      document.body.classList.remove("book-reading-mode");
    };
  }, [focusMode]);

  useEffect(() => {
    const position = pendingPosition.current;
    if (!position) return;
    pendingPosition.current = null;
    const restorePosition = () => {
      const reader = readerRef.current;
      if (!reader) return;
      const boundary = reader.querySelector(".book-reader__toolbar")
        ?.getBoundingClientRect().bottom ?? 0;
      const delta = position.element.getBoundingClientRect().top - boundary - position.offset;
      (focusMode ? reader : window).scrollBy({ top: delta, behavior: "instant" });
    };
    let frame = requestAnimationFrame(() => {
      restorePosition();
      // Returning to document flow can move the toolbar into its sticky position.
      // Measure once more after that scroll so the chapter keeps the same offset.
      frame = requestAnimationFrame(restorePosition);
    });
    return () => cancelAnimationFrame(frame);
  }, [focusMode]);

  useEffect(() => {
    if (!focusMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (
        event.key !== "Escape" &&
        target instanceof Element &&
        target.closest("pre, code, table, .reader-diagram, input, textarea, select, [contenteditable='true']")
      ) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToChapter(activeIndex + 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToChapter(activeIndex - 1);
      }

      if (event.key === "Escape") {
        changeReadingMode(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, focusMode, goToChapter, changeReadingMode]);

  return (
    <section ref={readerRef} className={focusMode ? "book-reader book-reader--focus" : "book-reader"}>
      <div className="book-reader__toolbar" aria-label="Book reader controls">
        <div className="min-w-0">
          <span className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
            Chapter
          </span>
          <p className="mt-1 truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {activeChapter?.text ?? "Start"}
          </p>
        </div>
        <div className="book-reader__mode-indicator" aria-hidden>
          <span className={focusMode ? "" : "is-active"}>通常</span>
          <span className={focusMode ? "is-active" : ""}>読書</span>
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
            onClick={() => changeReadingMode(!focusMode)}
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

      {chapterList.length > 0 ? (
        <ol className="book-reader__chapter-rail" aria-label="Chapters">
          {chapterList.map((chapter, index) => {
            const isActive = index === activeIndex;

            return (
              <li key={chapter.id} className="min-w-0">
                <button
                  type="button"
                  className={
                    isActive
                      ? "book-reader__chapter-tab book-reader__chapter-tab--active"
                      : "book-reader__chapter-tab"
                  }
                  onClick={() => goToChapter(index)}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="book-reader__chapter-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{chapter.text}</span>
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}

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
