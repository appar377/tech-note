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
    "name": "世界の拡張子",
    "slug": "world-file-extensions",
    "category": "File Formats",
    "subtitle": "MDXから、ファイルの中身と読み込み処理をたどる",
    "description": "ファイルの用途と、読み込むツールを確かめるシリーズです。現在読めるのはMDXの記事です。Markdownの文章、コンポーネント、frontmatter、描画や公開の処理を分けて読みます。",
    "goal": "拡張子から得た手がかりを、MDXの中身と利用ツールで確かめ、表示や公開の条件をどこで確認するか判断できるようにします。",
    "audience": [
      "プロジェクトのMDX文書が、どの処理で表示されるか知りたい人",
      "Markdownにコンポーネントを組み込むとき、本文と描画側の役割を分けたい人"
    ],
    "prerequisites": [
      "テキストエディタでファイルを開けること",
      "Markdownの見出しとコードブロックを読めること"
    ],
    "outcomes": [
      "Markdownの文章と、MDXのコンポーネントを区別して読める",
      "本文をコンパイルする処理と、登録された部品を使って描画する処理を分けられる",
      "frontmatterの項目と、サイトが決める公開条件を分けて確認できる"
    ],
    "concept": "一つの形式について、本文の最小例と、それを処理するツールを対応付けます。MDXでは文章、コンポーネント、メタデータ、描画・公開の条件を読みます。形式ごとに必要な問いと例を選びます。",
    "sections": [
      {
        "title": "MDXの文章と描画処理を分けて読む",
        "description": "MDXの記事1本を収録しています。小さな描画例を通して、コンポーネントの登録、frontmatter、利用するツールによる記法の違いを確認します。",
        "articleSlugs": [
          "file-formats/extensions/mdx"
        ]
      }
    ],
    "notes": [
      {
        "title": "現在読める範囲",
        "body": "収録しているのはMDXの記事です。本文には、確認に使うライブラリの版と、実行・表示の確認範囲を記載します。ほかの形式を追加するときは、入口の説明と到達点も収録内容に合わせて更新します。"
      }
    ],
    "references": [
      {
        "title": "IANA Media Types",
        "href": "https://www.iana.org/assignments/media-types/media-types.xhtml"
      },
      {
        "title": "MDN Web Docs: Common MIME types",
        "href": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types"
      }
    ]
  }),
] as const satisfies readonly SeriesBookDefinition[];

const seriesBookBySlug = new Map(SERIES_BOOKS.map((book) => [book.slug, book]));

export function getSeriesBookDefinition(slugOrName: string) {
  return seriesBookBySlug.get(slugify(slugOrName));
}
