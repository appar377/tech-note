import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex min-w-0 flex-wrap items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex min-w-0 items-center gap-1">
          {index > 0 ? <ChevronRight aria-hidden size={14} className="shrink-0" /> : null}
          {item.href ? (
            <Link href={item.href} className="truncate hover:text-zinc-950 dark:hover:text-zinc-50">
              {item.label}
            </Link>
          ) : (
            <span className="break-words text-zinc-700 dark:text-zinc-300">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
