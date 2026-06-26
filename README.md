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
series:
  name: Railsで生SQLを書くときに知っておきたいSQL
  order: 1
draft: false
popular: true
---
```

`draft: true` の記事は公開対象から除外されます。
