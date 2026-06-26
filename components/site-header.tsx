import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/tags", label: "Tags" },
  { href: "/series", label: "Series" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/85 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold text-zinc-950 dark:text-zinc-50">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
            <BookOpen aria-hidden size={17} />
          </span>
          <span className="truncate">Tech Note</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            aria-label="検索"
            title="検索"
          >
            <Search aria-hidden size={17} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
