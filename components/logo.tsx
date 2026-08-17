import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={`logo-mark grid shrink-0 place-items-center rounded-lg border ${className}`}
      aria-hidden
    >
      <span className="font-mono text-[0.72em] font-black leading-none text-zinc-950 dark:text-white">
        TN<span className="text-blue-600 dark:text-cyan-300">.</span>
      </span>
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
          Tech Note<span className="text-emerald-700 dark:text-cyan-300">.</span>
        </span>
        <span className="hidden truncate text-xs leading-4 text-zinc-500 dark:text-zinc-400 sm:block">
          Knowledge archive
        </span>
      </span>
    </Link>
  );
}
