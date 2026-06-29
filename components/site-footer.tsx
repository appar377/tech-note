import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { GITHUB_REPO_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--tech-border)", background: "var(--tech-surface-strong)" }}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark className="h-8 w-8" />
          <p className="min-w-0 break-words">Tech Note - personal engineering knowledge base.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/books" className="hover:text-cyan-700 dark:hover:text-cyan-300">
            Books
          </Link>
          <Link href="/search" className="hover:text-cyan-700 dark:hover:text-cyan-300">
            Search
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-700 dark:hover:text-cyan-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
