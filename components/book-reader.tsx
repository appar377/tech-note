"use client";

import { type CSSProperties, type ReactNode, type TouchEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, List, ScrollText } from "lucide-react";
import type { TableOfContentsItem } from "@/lib/articles";
import { bookReaderUrl, clampBookPage, readBookReaderLocation, type BookReaderPosition } from "@/lib/book-reader-location";
import styles from "./book-reader.module.css";

type BookReaderProps = { chapters: TableOfContentsItem[]; title: string; children: ReactNode };
type ReaderPage = { number: number; label: string; chapterId: string };
type PendingScroll = { anchor?: string; focus?: boolean; revealReader?: boolean };
type SwipeStart = { x: number; y: number; time: number };

const INTERACTIVE_CONTENT = "a, button, input, textarea, select, summary, video, audio, iframe, [contenteditable]:not([contenteditable='false']), [role='slider'], [role='tab'], [role='textbox'], [role='grid'], pre, code, table, .code-block, .reader-diagram, [data-book-no-swipe]";

export function BookReader({ chapters, title, children }: BookReaderProps) {
  const readerId = useId();
  const readerRef = useRef<HTMLElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const modeButtonRef = useRef<HTMLButtonElement>(null);
  const leafElements = useRef<HTMLElement[]>([]);
  const positionRef = useRef<BookReaderPosition>({ mode: "continuous", page: 1 });
  const pendingScroll = useRef<PendingScroll | null>(null);
  const turnAnimation = useRef<Animation | null>(null);
  const swipeStart = useRef<SwipeStart | null>(null);
  const [pages, setPages] = useState<ReaderPage[]>([]);
  const [position, setPosition] = useState<BookReaderPosition>({ mode: "continuous", page: 1 });
  const currentPage = pages[position.page - 1];
  const paged = position.mode === "pages";
  const chapterList = chapters.filter(chapter => chapter.depth === 2);

  const anchorPage = useCallback((hash: string) => {
    let id: string;
    try { id = decodeURIComponent(hash.replace(/^#/, "")); } catch { return undefined; }
    const element = id ? document.getElementById(id) : null;
    const leaf = element?.closest<HTMLElement>("[data-book-page]");
    if (!leaf || !readerRef.current?.contains(leaf)) return undefined;
    return Number(leaf.dataset.bookPage);
  }, []);

  const commitPosition = useCallback((next: BookReaderPosition, scroll: PendingScroll) => {
    positionRef.current = next;
    pendingScroll.current = scroll;
    setPosition(next);
  }, []);

  const navigatePage = useCallback((requestedPage: number, anchor = "") => {
    const next = { ...positionRef.current, page: clampBookPage(requestedPage, leafElements.current.length) };
    if (next.page === positionRef.current.page && !anchor) return;
    turnAnimation.current?.cancel();
    if (next.mode === "pages" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const direction = next.page > positionRef.current.page ? 1 : -1;
      turnAnimation.current = paperRef.current?.animate([
        { opacity: 0.65, transform: `perspective(1200px) translateX(${direction * 9}px) rotateY(${direction * 1.5}deg)` },
        { opacity: 1, transform: "perspective(1200px) translateX(0) rotateY(0)" },
      ], { duration: 210, easing: "cubic-bezier(.2,0,.2,1)" }) ?? null;
    }
    window.history.pushState(null, "", bookReaderUrl(new URL(window.location.href), next, anchor));
    commitPosition(next, { anchor, focus: true });
  }, [commitPosition]);

  const changeMode = useCallback(() => {
    const current = positionRef.current;
    let page = current.page;
    if (current.mode === "continuous") {
      const toolbarBottom = readerRef.current?.querySelector<HTMLElement>("[data-book-toolbar]")?.getBoundingClientRect().bottom ?? 0;
      const visibleLeaf = leafElements.current.find(leaf => leaf.getBoundingClientRect().bottom > toolbarBottom + 16);
      page = visibleLeaf ? Number(visibleLeaf.dataset.bookPage) : current.page;
    }
    const next: BookReaderPosition = { mode: current.mode === "pages" ? "continuous" : "pages", page };
    const hash = window.location.hash;
    const anchor = anchorPage(hash) === page ? hash : firstPageAnchor(leafElements.current[page - 1]);
    window.history.pushState(null, "", bookReaderUrl(new URL(window.location.href), next, anchor));
    commitPosition(next, { anchor, focus: true, revealReader: next.mode === "pages" });
  }, [anchorPage, commitPosition]);

  useEffect(() => {
    const syncFromLocation = () => {
      const url = new URL(window.location.href);
      const next = readBookReaderLocation(url, leafElements.current.length, anchorPage(url.hash));
      commitPosition(next, { anchor: url.hash, revealReader: next.mode === "pages" });
    };
    const frame = requestAnimationFrame(() => {
      leafElements.current = Array.from(readerRef.current?.querySelectorAll<HTMLElement>("[data-book-page]") ?? []);
      setPages(leafElements.current.map(leaf => ({
        number: Number(leaf.dataset.bookPage),
        label: leaf.dataset.bookPageLabel ?? "本文",
        chapterId: leaf.dataset.bookChapterId ?? "",
      })));
      syncFromLocation();
    });
    window.addEventListener("popstate", syncFromLocation);
    window.addEventListener("hashchange", syncFromLocation);
    return () => {
      cancelAnimationFrame(frame);
      turnAnimation.current?.cancel();
      window.removeEventListener("popstate", syncFromLocation);
      window.removeEventListener("hashchange", syncFromLocation);
    };
  }, [anchorPage, commitPosition]);

  useEffect(() => {
    const request = pendingScroll.current;
    if (!request) return;
    pendingScroll.current = null;
    const frame = requestAnimationFrame(() => {
      const paper = paperRef.current;
      const leaf = leafElements.current[position.page - 1];
      if (!paper || !leaf) return;
      if (position.mode === "pages") paper.scrollTop = 0;
      let anchor: HTMLElement | null = null;
      try { anchor = document.getElementById(decodeURIComponent((request.anchor ?? "").replace(/^#/, ""))); } catch { /* Malformed hashes keep the page readable. */ }
      if (request.revealReader) readerRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
      if (anchor && leaf.contains(anchor)) anchor.scrollIntoView({ block: "start", behavior: "instant" });
      else if (position.mode === "continuous" && request.focus) leaf.scrollIntoView({ block: "start", behavior: "instant" });
      if (request.focus) (position.mode === "pages" ? paper : modeButtonRef.current)?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [position]);

  useEffect(() => {
    const onLinkClick = (event: MouseEvent) => {
      if (positionRef.current.mode !== "pages" || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search || !url.hash) return;
      const page = anchorPage(url.hash);
      if (!page) return;
      event.preventDefault();
      navigatePage(page, url.hash);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (positionRef.current.mode !== "pages" || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target;
      if (!(target instanceof Element) || !readerRef.current?.contains(target)) return;
      if (event.key === "Escape") { event.preventDefault(); changeMode(); return; }
      if (target.closest(INTERACTIVE_CONTENT) || hasSelectedText()) return;
      const current = positionRef.current.page;
      const destinations: Record<string, number> = {
        ArrowLeft: current - 1, PageUp: current - 1,
        ArrowRight: current + 1, PageDown: current + 1,
        Home: 1, End: leafElements.current.length,
      };
      if (destinations[event.key] === undefined) return;
      event.preventDefault();
      navigatePage(destinations[event.key]);
    };
    document.addEventListener("click", onLinkClick);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onLinkClick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [anchorPage, changeMode, navigatePage]);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    swipeStart.current = null;
    if (!paged || event.touches.length !== 1 || hasSelectedText()) return;
    const target = event.target;
    if (!(target instanceof Element) || target.closest(INTERACTIVE_CONTENT) || hasHorizontalScroller(target, paperRef.current)) return;
    const touch = event.touches[0];
    swipeStart.current = { x: touch.clientX, y: touch.clientY, time: performance.now() };
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || event.changedTouches.length !== 1 || event.touches.length || hasSelectedText()) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (performance.now() - start.time > 650 || Math.abs(dx) < 75 || Math.abs(dy) > 45 || Math.abs(dx) < Math.abs(dy) * 2.5) return;
    navigatePage(positionRef.current.page + (dx < 0 ? 1 : -1));
  };

  const visibilityRule = paged
    ? `@media screen { [data-reader-id="${readerId}"] [data-book-page]:not([data-book-page="${position.page}"]) { display: none; } }`
    : "";
  const progress = pages.length ? position.page / pages.length : 0;

  return (
    <section ref={readerRef} className={styles.reader} data-reader-id={readerId} data-reading-mode={position.mode} aria-label={`${title}の本文`}>
      <style>{visibilityRule}</style>
      <div className={styles.toolbar} data-book-toolbar>
        <div className={styles.position}>
          <span className={styles.eyebrow}>{paged ? "ページをめくって読む" : "全文を読む"}</span>
          <span className={styles.pageTitle}>{paged ? currentPage?.label ?? title : title}</span>
        </div>
        <div className={styles.toolbarActions}>
          {paged ? <div className={styles.compactPagination}>
            <button type="button" className={styles.compactButton} onClick={() => navigatePage(positionRef.current.page - 1)} disabled={position.page <= 1} aria-label="前のページへ移動"><ChevronLeft size={17} aria-hidden /></button>
            <span className={styles.compactNumber}>{position.page} / {pages.length}</span>
            <button type="button" className={styles.compactButton} onClick={() => navigatePage(positionRef.current.page + 1)} disabled={position.page >= pages.length} aria-label="次のページへ移動"><ChevronRight size={17} aria-hidden /></button>
          </div> : null}
          <button ref={modeButtonRef} type="button" className={styles.modeButton} onClick={changeMode} disabled={!pages.length} aria-pressed={paged}>
            {paged ? <ScrollText size={16} aria-hidden /> : <BookOpen size={16} aria-hidden />}
            {paged ? "通常表示" : "ページで読む"}
          </button>
        </div>
      </div>
      <details className={styles.contents}>
        <summary><List size={16} aria-hidden />章の目次</summary>
        <ol>{chapterList.map((chapter, index) => (
          <li key={chapter.id}><a href={`#${chapter.id}`} aria-current={paged && currentPage?.chapterId === chapter.id ? "location" : undefined}>
            <span>{String(index + 1).padStart(2, "0")}</span>{chapter.text}
          </a></li>
        ))}</ol>
      </details>
      <div className={styles.paperStack}>
        {paged ? <div className={styles.runningHead} aria-hidden><span>{title}</span><span>{String(position.page).padStart(2, "0")}</span></div> : null}
        <div ref={paperRef} className={styles.paper} tabIndex={paged ? 0 : undefined} aria-label={paged ? `ページ ${position.page}の本文。長いページは縦にスクロールできます` : undefined} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={() => { swipeStart.current = null; }}>
          {children}
        </div>
      </div>
      {paged ? <>
        <div className={styles.progress} style={{ "--book-progress": progress } as CSSProperties} aria-hidden><span /></div>
        <nav className={styles.pagination} aria-label="ブックのページ移動">
          <button type="button" className={styles.pageButton} onClick={() => navigatePage(positionRef.current.page - 1)} disabled={position.page <= 1} aria-label="前のページ"><ChevronLeft size={18} aria-hidden /><span>前のページ</span></button>
          <p className={styles.pageNumber} role="status" aria-live="polite" aria-atomic="true">{position.page} <span>/ {pages.length} ページ</span></p>
          <button type="button" className={styles.pageButton} onClick={() => navigatePage(positionRef.current.page + 1)} disabled={position.page >= pages.length} aria-label="次のページ"><span>次のページ</span><ChevronRight size={18} aria-hidden /></button>
        </nav>
        <p className={styles.hint}>← → / Page Up・Down で移動、Home・End で先頭・末尾。本文の横スワイプでもめくれます。</p>
      </> : null}
      <noscript><p>全文を表示しています。ページをめくる操作はJavaScriptが有効なときに使えます。</p></noscript>
    </section>
  );
}

function hasSelectedText() {
  const selection = window.getSelection();
  return Boolean(selection && !selection.isCollapsed);
}

function firstPageAnchor(page?: HTMLElement) {
  return page?.querySelector<HTMLElement>("h2[id], h3[id], h4[id], [id]")?.id ?? "";
}

function hasHorizontalScroller(target: Element, boundary: Element | null) {
  for (let element: Element | null = target; element && element !== boundary; element = element.parentElement) {
    const style = getComputedStyle(element);
    if (element.scrollWidth > element.clientWidth + 2 && /auto|scroll/.test(style.overflowX)) return true;
  }
  return false;
}
