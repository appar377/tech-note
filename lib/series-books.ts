import { slugify } from "./slug";

export type SeriesBookSectionDefinition = {
  title: string;
  description: string;
  articleSlugs: string[];
};

export type SeriesBookNote = {
  title: string;
  body: string;
};

export type SeriesBookReference = {
  title: string;
  href?: string;
  note?: string;
};

export type SeriesBookDefinition = {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subtitle: string;
  description: string;
  goal: string;
  audience: string[];
  prerequisites: string[];
  outcomes: string[];
  concept: string;
  sections: SeriesBookSectionDefinition[];
  notes: SeriesBookNote[];
  references: SeriesBookReference[];
};

type SeriesBookInput = Omit<SeriesBookDefinition, "slug" | "categorySlug"> & {
  slug?: string;
  categorySlug?: string;
};

function defineSeriesBook(book: SeriesBookInput): SeriesBookDefinition {
  return {
    ...book,
    slug: book.slug ?? slugify(book.name),
    categorySlug: book.categorySlug ?? slugify(book.category),
  };
}

export const SERIES_BOOKS = [
  defineSeriesBook({
    name: "Database Internal",
    category: "Database",
    subtitle: "SQLが実行される流れを、OptimizerとExecution Planから読む技術書",
    description:
      "SQL構文の暗記ではなく、Parser、Optimizer、Execution Plan、Storage Engineの流れを軸に、DBが問い合わせをどう解釈し、なぜ速い・遅いが生まれるのかを学ぶシリーズです。",
    goal:
      "EXPLAINを根拠に、SQLがどの段階で展開・最適化・実行されるのかを説明でき、推測ではなく実行計画から改善方針を立てられる状態を目指します。",
    audience: [
      "SQLの実行計画を読めるようになりたいエンジニア",
      "View、CTE、派生テーブルなどを内部動作から使い分けたい人",
      "DBチューニングを暗記ではなく仕組みから理解したい人",
    ],
    prerequisites: [
      "SELECT、WHERE、JOINの基本構文",
      "Indexという言葉の基本的な意味",
      "MySQLまたはPostgreSQLでSQLを実行した経験",
    ],
    outcomes: [
      "SQLがParserからOptimizerへ渡される流れを説明できる",
      "View、CTE、Temporary Tableの違いを実行計画と結びつけて判断できる",
      "EXPLAINとEXPLAIN ANALYZEの出力から、推定値と実測値を読み分けられる",
    ],
    concept:
      "Application -> SQL -> Parser -> Resolver / Rewrite -> Optimizer -> Execution Plan -> Executor -> Storage Engine -> Buffer Pool / Disk という流れを、各記事で少しずつ分解します。",
    sections: [
      {
        title: "問い合わせはどこで形を変えるのか",
        description:
          "View、派生テーブル、CTE、一時テーブルを、見た目ではなくOptimizerとStorage Engineがどう扱うかで整理します。",
        articleSlugs: ["sql/internal/view-derived-table-cte-temporary-table"],
      },
      {
        title: "実行計画を読んで根拠を持つ",
        description:
          "EXPLAINとEXPLAIN ANALYZEを使い、推定値・実測値・スキャン方式からSQLの実行内容を読み解きます。",
        articleSlugs: ["sql/internal/explain-analyze"],
      },
    ],
    notes: [
      {
        title: "読み方",
        body:
          "このシリーズでは、個別のSQL構文を覚える前に「SQLがどの処理段階で変換されるのか」を押さえます。記事単体でも読めますが、上から順に読むと実行計画の意味がつながります。",
      },
    ],
    references: [
      {
        title: "MySQL EXPLAIN documentation",
        href: "https://dev.mysql.com/doc/refman/8.4/en/explain.html",
      },
      {
        title: "PostgreSQL EXPLAIN documentation",
        href: "https://www.postgresql.org/docs/current/using-explain.html",
      },
    ],
  }),
  defineSeriesBook({
    name: "Railsで生SQLを書くときに知っておきたいSQL",
    category: "Rails",
    subtitle: "Migrationとバッチ処理で、ActiveRecordだけに閉じないSQL設計を身につける",
    description:
      "Rails実務で生SQLを書く場面を、集合処理、Window Function、UPSERTの順に整理します。Rubyで1件ずつ処理する前に、DB内部でまとめて処理できないか判断するためのシリーズです。",
    goal:
      "Migrationやバッチ処理で、ActiveRecordの外に出るべき場面を判断し、SQLで一括処理する設計・実装・注意点を説明できる状態を目指します。",
    audience: [
      "普段はActiveRecord中心で開発しているRailsエンジニア",
      "Migrationやデータ移行で大量データを扱う人",
      "SQLを実務のRailsコードに落とし込んで理解したい人",
    ],
    prerequisites: [
      "RailsのMigrationとActiveRecordの基本",
      "SELECT、INSERT、UPDATEの基本構文",
      "MySQLまたはPostgreSQLの基本操作",
    ],
    outcomes: [
      "RubyループとSQL集合処理の違いを説明できる",
      "INSERT SELECTやWindow FunctionをMigrationで使える",
      "UPSERTを使って冪等なデータ投入を設計できる",
    ],
    concept:
      "Rails code -> execute -> SQL -> DB Engine -> Set-based processing という流れで、アプリケーション側に持ち出さずDB内部で処理する判断基準を作ります。",
    sections: [
      {
        title: "Railsから生SQLを読むための全体像",
        description:
          "まず、Migrationやバッチで生SQLが必要になる場面と、ActiveRecordだけでは見えにくいSQLの考え方を押さえます。",
        articleSlugs: ["rails/sql/raw-sql-summary"],
      },
      {
        title: "集合処理としてSQLを書く",
        description:
          "検索結果をそのまま投入する、グループ内順位を付けるなど、RubyループではなくSQLでまとめて処理する考え方を学びます。",
        articleSlugs: ["rails/sql/insert-select", "rails/sql/row-number"],
      },
      {
        title: "再実行に強い投入処理を作る",
        description:
          "一度失敗して再実行しても壊れにくいMigrationを作るため、重複キー時のUPSERTを整理します。",
        articleSlugs: ["rails/sql/on-duplicate-key-update"],
      },
    ],
    notes: [
      {
        title: "Rails記事としての位置づけ",
        body:
          "このシリーズはSQLそのものの網羅ではなく、RailsのMigrationやバッチ処理で生SQLを安全に使うための実務書として扱います。",
      },
    ],
    references: [
      {
        title: "Rails Active Record Migrations guide",
        href: "https://guides.rubyonrails.org/active_record_migrations.html",
      },
      {
        title: "MySQL INSERT ... ON DUPLICATE KEY UPDATE documentation",
        href: "https://dev.mysql.com/doc/refman/8.4/en/insert-on-duplicate.html",
      },
    ],
  }),
] as const satisfies readonly SeriesBookDefinition[];

const seriesBookBySlug = new Map(SERIES_BOOKS.map((book) => [book.slug, book]));

export function getSeriesBookDefinition(slugOrName: string) {
  return seriesBookBySlug.get(slugify(slugOrName));
}
