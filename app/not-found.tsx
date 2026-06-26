import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell">
      <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
          Page not found
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          指定されたページは存在しないか、まだ公開されていません。
        </p>
        <Link href="/" className="icon-text-button mt-6">
          Home
        </Link>
      </div>
    </div>
  );
}
