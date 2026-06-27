import Link from "next/link";
import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { SiteLogo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/books", label: "Books" },
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/tags", label: "Tags" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex min-h-16 items-center gap-4">
          <SiteLogo />
          <nav className="hidden min-w-0 items-center gap-1 md:flex">
            {navItems.map((item) => (
              <HeaderLink key={item.href} href={item.href}>
                {item.label}
              </HeaderLink>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href="/search"
              className="icon-button"
              aria-label="検索"
              title="検索"
            >
              <Search aria-hidden size={17} />
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <nav className="-mx-4 flex gap-1 overflow-x-auto border-t border-zinc-200/70 px-4 py-2 dark:border-zinc-800/70 md:hidden">
          {navItems.map((item) => (
            <HeaderLink key={item.href} href={item.href}>
              {item.label}
            </HeaderLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HeaderLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
    >
      {children}
    </Link>
  );
}
