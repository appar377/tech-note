# Article 23: Access Tokenはメモリ、Refresh TokenはSecure Storageに保存する理由

## メタデータ

```yaml
article_id: 23
title: "Access Tokenはメモリ、Refresh TokenはSecure Storageに保存する理由"
slug: "access-token-memory-refresh-token-secure-storage"
series: "Flutter / Authentication"
tags:
  - flutter
  - authentication
  - access-token
  - refresh-token
  - secure-storage
output_path: "articles/23_access-token-memory-refresh-token-secure-storage.md"
thumbnail: "/images/articles/access-token-memory-refresh-token-secure-storage.png"
```

## この記事の出発点

Access TokenとRefresh Tokenを同じストレージへ保存する実装が単純に見えたが、寿命、権限、再起動後の必要性、漏洩時の影響が異なる。メモリ保持とSecure Storageの分離を検討した。

## 中心命題

一般的には短命なAccess Tokenをメモリ、長命で再発行能力を持つRefresh TokenをSecure Storageへ置くと、永続化する秘密を減らせる。ただし絶対解ではなく、脅威モデル、UX、認証基盤の仕様で判断する。

## 必須構成

1. Access TokenとRefresh Tokenの権限・寿命
2. アプリ再起動時にAccess Tokenをrefreshで再取得する流れ
3. ログアウト時の削除範囲
4. `deleteAll()`ではなく専用キー削除を検討
5. refresh token rotation
6. 端末紛失・root/jailbreak・ログ漏洩
7. 複数アカウントとキー名前空間
8. Secure Storage失敗時の扱い

## 必須コード・検証

- `AuthTokenHolder`のメモリ実装
- `TokenStorage`のrefresh token専用API
- 起動時bootstrapとlogoutの例
- Access Tokenが永続化されていないことを確認するtest

## 技術的に必ず守る事実

- OAuth/OIDCサーバーの仕様を確認する
- Secure Storageは暗号化やOS保護を利用するが、侵害端末での完全防御ではない
- Access Tokenをメモリだけに置けない要件もある

## メリット・デメリットとして扱う点

- メモリ保持: 永続漏洩面を減らす／再起動時refreshが必要
- 永続化: UXが単純／保存秘密と攻撃面が増える

## 避ける記述

- この保存戦略が全アプリの唯一解と断定しない
- Refresh Tokenをログへ出さない

## 記事の結論

トークンの保存場所は「秘密だから全部Secure Storage」ではなく、寿命と再発行能力に応じて最小化する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
