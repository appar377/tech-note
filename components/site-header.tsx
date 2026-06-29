import Link from "next/link";
import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { SiteLogo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/books", label: "Books" },
  { href: "/series", label: "Series" },
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/tags", label: "Tags" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-xl" style={{ borderColor: "var(--tech-border)", background: "var(--tech-surface-strong)" }}>
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
        <nav className="-mx-4 flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden" style={{ borderColor: "var(--tech-muted-border)" }}>
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
      className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-cyan-500/10 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-zinc-400 dark:hover:bg-cyan-400/10 dark:hover:text-zinc-50"
    >
      {children}
    </Link>
  );
}
