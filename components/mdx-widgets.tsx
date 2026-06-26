"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";

export function YouTube({ id, title = "YouTube video" }: { id: string; title?: string }) {
  return (
    <div className="not-prose my-8 aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export function Video({ src, title }: { src: string; title?: string }) {
  return (
    <video
      className="not-prose my-8 w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
      src={src}
      title={title}
      controls
      playsInline
    />
  );
}

export function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="not-prose my-6 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-zinc-950 dark:text-zinc-50"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{title}</span>
        <ChevronDown
          aria-hidden
          size={18}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">{children}</div> : null}
    </div>
  );
}
