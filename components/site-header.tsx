"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/articles", label: "記事" },
  { href: "/books", label: "ブック" },
  { href: "/series", label: "シリーズ" },
  { href: "/notes", label: "ノート" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="reading-header">
      <div className="reading-header__inner">
        <Link href="/" className="wordmark" aria-label="Tech Note ホーム">
          <span aria-hidden className="wordmark__mark">
            t.
          </span>
          tech note
        </Link>
        <nav aria-label="メインナビゲーション">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="reading-header__actions">
          <Link href="/search">検索</Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
