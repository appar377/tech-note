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
    "subtitle": "文章・設定・表・画像・Webコードの中身と処理を読む",
    "description": "MDX、Markdown、JSON、YAML、CSV/TSV、SVG、HTML、CSS、JavaScript/TypeScriptを、最小例と利用ツールから読むシリーズです。拡張子、内容の形式、実行や表示の条件を分けて確かめます。",
    "goal": "拡張子を手がかりに中身と利用ツールを確かめ、構文・意味・表示・実行の条件をどこで確認するか判断できるようにします。",
    "audience": [
      "文書や設定ファイルを開いたとき、何を読むべきか知りたい人",
      "ファイルの形式と、それを使うアプリケーションの契約を分けたい人"
    ],
    "prerequisites": [
      "テキストエディタでファイルを開けること",
      "Markdownの見出しとコードブロックを読めること"
    ],
    "outcomes": [
      "文書、設定、表、画像、実行するコードの読み方を区別できる",
      "構文が正しいことと、アプリケーションが受け入れることを分けられる",
      "拡張子だけでは表示・実行・安全性を保証できない理由を説明できる"
    ],
    "concept": "文書からデータ、画像、Webの表示と実行へ進みます。形式ごとに本文の最小例と利用ツールを対応付け、構文の規則と使う側の規則を区別します。",
    "sections": [
      {
        "title": "文章と描画を分ける",
        "description": "MDXの部品とMarkdownの記法を読み、文書をどの処理へ渡すか確認します。",
        "articleSlugs": [
          "file-formats/extensions/mdx", "file-formats/extensions/markdown"
        ]
      },
      {
        "title": "設定と表を読み取る",
        "description": "JSON、YAML、CSV/TSVから値を読むとき、構文、型、アプリケーション側の契約を分けます。",
        "articleSlugs": ["file-formats/extensions/json", "file-formats/extensions/yaml", "file-formats/extensions/csv"]
      },
      {
        "title": "Webの画像・構造・見た目・実行を分ける",
        "description": "SVG、HTML、CSS、JavaScript/TypeScriptの役割と、ブラウザやビルド処理との関係を読みます。",
        "articleSlugs": ["file-formats/extensions/svg", "file-formats/extensions/html", "file-formats/extensions/css", "file-formats/extensions/javascript-typescript"]
      }
    ],
    "notes": [
      {
        "title": "形式と処理するツールは別に確認する",
        "body": "同じ拡張子でも処理するツールや設定で結果が変わります。各記事の最小例と確認範囲を読み、実際のプロジェクトのスキーマ、ビルド、表示の条件を確かめてください。"
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
  defineSeriesBook({
    name: "Lambda APIを入口と権限から読む",
    slug: "lambda-api-boundaries",
    category: "AWS",
    subtitle: "呼び出す入口、動くコード、許可する対象を分ける",
    description: "API Gatewayからhandlerへ届く入力と、Lambdaの実行ロール・利用者ごとの認可を2記事で整理します。",
    goal: "HTTPの入口、実行環境、AWSへの許可、対象ごとの認可を別の確認項目として説明できるようにします。",
    audience: ["LambdaでAPIを作るとき、TypeScriptとAWSの役割を整理したい人", "IAMの設定だけで利用者の認可が済むか迷っている人"],
    prerequisites: ["HTTPリクエストと応答の概要", "TypeScriptの関数を読めること"],
    outcomes: ["ビルドとhandler設定を分けて読める", "実行ロールと利用者の認可を区別できる", "ローカル例の検証範囲とAWS上の確認を分けられる"],
    concept: "まずAPIの入口から実行される関数までを追い、次に誰のどの操作を許可するかを読む順番です。",
    sections: [
      { title: "入口からhandlerへ進む", description: "イベント形式とJavaScriptの配置を対応付けます。", articleSlugs: ["aws/lambda/typescript-handler-and-api-entry"] },
      { title: "実行主体と利用者の認可を分ける", description: "AWSへアクセスする権限と、業務上の対象を許可する判断を分けます。", articleSlugs: ["aws/iam/execution-role-and-user-authorization"] },
    ],
    notes: [{ title: "AWSへの配置・疎通は別の確認", body: "記事の合成イベントと所有者判定はローカル例です。実際のIAM、認証、SDK、DB、AWSへの配置はこのシリーズの実証範囲に含みません。" }],
    references: [{ title: "AWS Lambda Developer Guide", href: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html" }],
  }),
  defineSeriesBook({
    name: "Railsで生SQLを書くときに知っておきたいSQL",
    slug: "rails-raw-sql",
    category: "Rails",
    subtitle: "履歴から選び、集合で反映し、再実行を確かめる",
    description: "既存のSQL記事から、最新行の選択、INSERT SELECT、競合時の扱いとまとめの例を順に読みます。",
    goal: "どの行を選ぶか、どの行へ書くか、再実行で何を変えるかを分けて考えられるようにします。",
    audience: ["RailsでActiveRecordの外側のSQLを読む必要がある人"],
    prerequisites: ["SELECT、INSERT、WHEREの基本", "主キーと一意制約の概要"],
    outcomes: ["ROW_NUMBERの並び順と最新行の条件を確認できる", "INSERT SELECTで集合を反映できる", "DB製品ごとの競合構文と再実行の契約を区別できる"],
    concept: "構文別の記事を確認してから、一つの課題で選択と反映を組み合わせます。独立本文のRails Raw SQLブックも併せて読めます。",
    sections: [
      { title: "行を選ぶ", description: "最新行を決める並び順と同時刻の扱いを確認します。", articleSlugs: ["rails/sql/row-number"] },
      { title: "集合を反映する", description: "選択した行を追加し、重複時の扱いをDBごとに読みます。", articleSlugs: ["rails/sql/insert-select", "rails/sql/on-duplicate-key-update"] },
      { title: "選択と反映をつなぐ", description: "説明用の履歴を使い、初回と再投入で残る状態を確認します。", articleSlugs: ["rails/sql/raw-sql-summary"] },
    ],
    notes: [{ title: "実行するDBの違いを読む", body: "ON DUPLICATE KEY UPDATEとON CONFLICTは同じ構文ではありません。各記事で対象のDBと実行確認の範囲を確認してください。" }],
    references: [{ title: "独立したブック: Rails Raw SQL", href: "/books/rails-raw-sql" }],
  }),
] as const satisfies readonly SeriesBookDefinition[];

const seriesBookBySlug = new Map(SERIES_BOOKS.map((book) => [book.slug, book]));

export function getSeriesBookDefinition(slugOrName: string) {
  return seriesBookBySlug.get(slugify(slugOrName));
}
