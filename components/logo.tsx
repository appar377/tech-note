import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={`logo-mark grid shrink-0 place-items-center rounded-lg border ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 40 40" className="h-full w-full" fill="none">
        <path
          d="M12 10.5H28"
          stroke="#22D3EE"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path d="M13 15H19V29H13V15Z" fill="currentColor" />
        <path
          d="M22 15H27.5C29.4 15 31 16.6 31 18.5V29H25.5C23.6 29 22 27.4 22 25.5V15Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M26 19H28"
          stroke="#34D399"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function SiteLogo() {
  return (
    <Link
      href="/"
      className="flex min-w-0 items-center gap-3 rounded-lg outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="Tech Note home"
    >
      <LogoMark />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold leading-5 text-zinc-950 dark:text-zinc-50">
          Tech Note
        </span>
        <span className="hidden truncate text-xs leading-4 text-cyan-700 dark:text-cyan-300 sm:block">
          Learning Library
        </span>
      </span>
    </Link>
  );
}
