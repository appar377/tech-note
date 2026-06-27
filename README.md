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

全公開記事は、少なくとも次の見出しを持つ必要があります。

- `概要`
- `この記事で学べること`
- `前提知識`
- `本編`
- `図解`
- `内部動作`
- `まとめ`
- `参考文献`

カテゴリごとの追加要件があります。

- SQL / Database: `SQL例`, `EXPLAIN`, `実際の性能比較`
- Git: `Gitコマンド例`
- Linux / Docker / AWS: `CLI・設定例`
- Rails / Flutter / Next.js: `実装コード例`
- Computer Science: `疑似コード`, `計算量`

図解は必須です。Mermaid、画像、SVG、Canvasなどを本文に含めます。SEOの目安として本文は4,000〜8,000文字程度を推奨しますが、CIでは警告のみです。

新規記事は `templates/article-template.mdx` を元に作成します。
