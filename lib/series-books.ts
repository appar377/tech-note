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
    name: "世界の拡張子",
    slug: "world-file-extensions",
    category: "File Formats",
    subtitle: "拡張子ごとに、用途・中身・関連ツール・注意点を一つずつ整理する図鑑シリーズ",
    description:
      "`.mdx`、`.json`、`.yaml`、`.env`、`.lock` など、開発で出会う拡張子を1本ずつ取り上げ、何のためのファイルなのか、何で開くのか、実務でどこに注意するのかを整理するシリーズです。",
    goal:
      "ファイル名の末尾だけで判断せず、拡張子が示す形式、実際の中身、利用するツール、壊しやすいポイントを説明できる状態を目指します。",
    audience: [
      "見慣れない拡張子を見るたびに調べ直している人",
      "プロジェクト内の設定ファイルや生成ファイルの役割を整理したい人",
      "記事、設定、ビルド、ロックファイルなどの違いを拡張子から理解したい人",
    ],
    prerequisites: [
      "ファイル名と拡張子の基本的な見方",
      "テキストファイルとバイナリファイルがあること",
      "エディタやターミナルでファイルを開いた経験",
    ],
    outcomes: [
      "拡張子が示す用途と、実際のファイル形式を分けて説明できる",
      "編集してよいファイルと、生成物として扱うべきファイルを見分けやすくなる",
      "未知の拡張子でも、関連ツール・中身・注意点の順に調べられる",
    ],
    concept:
      "Extension -> File format -> Content model -> Toolchain -> Runtime / Build impact -> Operational caveats の順で、拡張子ごとに同じ型で整理します。",
    sections: [
      {
        title: "ドキュメントとコードが混ざる拡張子",
        description:
          "Markdown系の拡張子から始め、文章、コード、コンポーネントがどこで混ざるのかを整理します。",
        articleSlugs: ["file-formats/extensions/mdx"],
      },
    ],
    notes: [
      {
        title: "シリーズの使い方",
        body:
          "このシリーズはカテゴリ横断の関連記事まとめではなく、拡張子ごとの図鑑として育てます。各記事は同じ観点で、用途、中身、関連ツール、実務上の注意点を扱います。",
      },
      {
        title: "今後追加する候補",
        body:
          ".json、.yaml、.env、.lock、.ts、.tsx、.sql、.md、.csv、.svg、.png、.webp などを、必要になった順に1拡張子1記事で追加していきます。",
      },
    ],
    references: [
      {
        title: "IANA Media Types",
        href: "https://www.iana.org/assignments/media-types/media-types.xhtml",
      },
      {
        title: "MDN Web Docs: Common MIME types",
        href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types",
      },
    ],
  }),
] as const satisfies readonly SeriesBookDefinition[];

const seriesBookBySlug = new Map(SERIES_BOOKS.map((book) => [book.slug, book]));

export function getSeriesBookDefinition(slugOrName: string) {
  return seriesBookBySlug.get(slugify(slugOrName));
}
