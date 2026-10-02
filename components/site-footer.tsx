import Link from "next/link";
import { GITHUB_REPO_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="reading-footer">
      <Link href="/" className="wordmark">
        tech note
      </Link>
      <nav aria-label="補助ナビゲーション">
        <Link href="/drafts">下書き</Link>
        <Link href="/reading">読書メモ</Link>
        <Link href="/profile">プロフィール</Link>
        <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </nav>
    </footer>
  );
}
