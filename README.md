# Tech Note

個人の技術知識を蓄積・公開するためのNext.js製ナレッジベースです。

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX
- Static export for GitHub Pages

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

`next.config.ts` はGitHub Pages向けに `output: "export"` と `basePath: "/tech-note"` を設定しています。`npm run build` 後、静的ファイルは `out/` に生成されます。

## Articles

記事は `articles/**/*.mdx` に配置します。

```yaml
---
title: 記事タイトル
description: 記事の説明
date: 2026-06-25
updated: 2026-06-25
tags:
  - SQL
category: Rails
level: 1
articleType: practical
series:
  name: Railsで生SQLを書くときに知っておきたいSQL
  order: 1
draft: false
popular: true
---
```

`draft: true` の記事は公開対象から除外されます。

## Books

Booksは記事の集合ではなく、記事で増えた知識を1つの目的に向けて再構成した本文です。調査メモとしての記事は参考リンクに留め、Book本文の中で章立て、説明順、図解、まとめ直しを行います。

Booksは `books/*.mdx` に配置します。

```yaml
---
title: Database Internal
subtitle: SQLが実行される流れから、実行計画を読めるようになる
description: Parser、Optimizer、Execution Plan、Storage Engineの流れを軸に整理するBook。
date: 2026-06-27
category: Database
level: 2
cover: /images/books/database-internal-cover.svg
access: free
status: published
featured: true
aliases:
  - Database Internal
references:
  - articleSlug: sql/internal/explain-analyze
    note: EXPLAINとEXPLAIN ANALYZEの調査メモ。
---
```

- `cover` はBookの表紙画像として、一覧、詳細、OGPで利用します。
- `access` は将来用のメタデータです。現時点では課金処理や公開画面のバッジ表示には使いません。
- `references` はBookの参考記事リンクとして表示します。本文はBook側で再構成します。
- 既存の `series` は記事側の分類互換として残しますが、主導線は `/books` です。

### Knowledge Domains

Tech Noteは単発ブログではなく、技術書をWeb化した知識サイトとして運用します。カテゴリは次の技術領域を中心に並びます。

- Git
- SQL
- Database
- Linux
- Docker
- AWS
- Rails
- Flutter
- Computer Science

既存運用に必要な補助カテゴリとして、Next.jsも扱います。

### Article Structure

記事は読者の問いに沿って構成します。`editorialProfile: question-led-v1` は、説明・一次資料への出典・具体例・見出しとコードの整合性を検査します。見出し名、最低文字数、図の有無だけで品質を判定しません。未完成の雛形、閉じていないコードブロック、出典のない本文は検査で拒否します。

公開本文・表紙・出典・metadataの整合性は `test/fixtures/content-integrity.json` とテストで確認します。内容を変更するときは一次資料と具体例を再確認してから対応する期待値を更新してください。ハッシュの更新だけで技術検証が完了するわけではありません。

## Reading UI

トップと検索から記事・ブック・ノートへ進めます。記事の前後移動は同じシリーズまたは同じフォルダの文脈を保ちます。Booksは独立したMDX本文、Seriesは既存記事への目次です。本文の目次、章移動、読書モード、ダーク表示を利用できます。

ブックの「ページで読む」は、章の先頭と段落・コード・表などのブロック量を目安に紙面を区切ります。長いコードや表を途中で分割せず、紙面内でスクロールできます。前後、章の目次、現在位置、左右キー・Page Up/Down・Home/End、本文の横スワイプを使えます。URLの `reader=pages&page=N` と見出しのhashで、再読込や戻るときの位置を復元します。本文選択、リンク、コード、表や図の横移動中にはスワイプでページをめくりません。動きを減らす設定では切替アニメーションを止めます。通常表示・印刷・JavaScript無効時は全文を読めます。

ノートは可変幅の罫線紙面です。スマホでは固定A4を縮小せず、余白を調整します。標準Markdownの画像・表に加え、必要な箇所で次のMDX部品を使えます。通常記事へ紙面の装飾を一律には付けません。

```mdx
<StickyNote tone="blue" title="判断の軸">確認することを短く書く。</StickyNote>
<RedUnderline>読み違えやすい条件</RedUnderline>
<BlueUnderline>中心となる判断</BlueUnderline>
<Notebook title="確認メモ">小さな検討を残す。</Notebook>
```

シリーズは `lib/series-books.ts` の収録順と、記事側の `series.name`・`slug`・`order` を合わせます。拡張子、Lambda API、Rails SQLの各入口は、収録している記事だけを説明します。

Mermaidは時間順にシーケンス図、分岐にフロー図、関係に依存図を選びます。図には `accTitle`・`accDescr` と本文の説明を添え、読み順や矢印の意味を示します。図の文字を小画面へ無理に縮めず、図の枠内で横へスクロールします。

## Private Drafts

`draft: true` は静的サイトの一覧・検索・本文出力から除外されます。ただし公開Gitリポジトリへcommitした原稿はソースとして閲覧できます。未公開原稿と内部検証記録は、この公開リポジトリの外で保管してください。

ローカル下書きレビューはdevelopment環境で `TECH_NOTE_PREVIEW=1` の場合だけ有効です。このスイッチは認証機能ではありません。本番ビルドでは有効になりません。

## Deployment

既存の `.github/workflows/pages.yml` がmainへのpush時にNode22で依存導入・lint・型検査・テスト・静的ビルドを行い、GitHub Pagesへ公開します。公開先は https://appar377.github.io/tech-note/ です。
