import type { Metadata } from "next";
import {
  BookMarked,
  CalendarDays,
  Languages,
  Library,
  Search,
  type LucideIcon,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { getReadingRecords, readingAreas } from "@/lib/reading-records";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reading",
  description: "読んだ本、学習中の本、そこから得た知識を公開する読書記録。",
  alternates: {
    canonical: absoluteUrl("/reading"),
  },
};

export default function ReadingPage() {
  const records = getReadingRecords();

  return (
    <div className="page-shell space-y-10">
      <header>
        <p className="tech-pill mb-4 gap-2 text-sm">
          <BookMarked aria-hidden size={15} />
          Reading notes
        </p>
        <h1 className="page-heading">Reading</h1>
        <p className="page-subtitle">
          技術書だけでなく、英語・韓国語・設計・キャリアなど、学習の土台になった本とメモを公開する場所です。
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <ReadingConcept
          icon={Library}
          title="読書ログ"
          description="読んだ本、読んでいる本、保留した本を記録します。"
        />
        <ReadingConcept
          icon={Search}
          title="学習への接続"
          description="要約だけで終わらせず、記事やBookへつながる気づきを残します。"
        />
        <ReadingConcept
          icon={Languages}
          title="領域を広げる"
          description="技術以外の言語学習や思考法も、同じ知識体系に入れていきます。"
        />
      </section>

      <section className="tech-card rounded-lg border p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Areas
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {readingAreas.map((area) => (
            <span
              key={area}
              className="rounded-lg border border-zinc-200 bg-white/50 px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-white/[0.03] dark:text-zinc-300"
            >
              {area}
            </span>
          ))}
        </div>
      </section>

      {records.length > 0 ? (
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">Reading Records</h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {records.length} books
            </span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {records.map((record) => (
              <article key={`${record.title}-${record.date}`} className="tech-card rounded-lg border p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="rounded-md bg-cyan-50 px-2 py-1 font-medium text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                    {record.status}
                  </span>
                  <span>{record.area}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  {record.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {record.author}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {record.description}
                </p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-500">
                  <CalendarDays aria-hidden size={14} />
                  {formatDate(record.date)}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="tech-card rounded-lg border p-8">
          <div className="max-w-2xl">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              <BookMarked aria-hidden size={22} />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
              まだ公開読書記録はありません
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              読書メモは、単なる感想ではなく「どの知識につながったか」まで残す場所にします。
              後から記事、Book、学習ロードマップへ接続しやすい形で管理します。
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function ReadingConcept({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="tech-card rounded-lg border p-5">
      <Icon aria-hidden size={20} className="text-cyan-700 dark:text-cyan-300" />
      <h2 className="mt-4 font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}
