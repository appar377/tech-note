import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { GITHUB_REPO_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark className="h-8 w-8" />
          <p className="min-w-0 break-words">Tech Note - personal engineering knowledge base.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/search" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Search
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
