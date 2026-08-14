# Article 11: RSpecのRequest SpecとController Specは何をテストしているのか

## メタデータ

```yaml
article_id: 11
title: "RSpecのRequest SpecとController Specは何をテストしているのか"
slug: "request-spec-vs-controller-spec"
series: "Rails / Testing"
tags:
  - rails
  - rspec
  - request-spec
  - controller-spec
output_path: "articles/11_request-spec-vs-controller-spec.md"
thumbnail: "/images/articles/request-spec-vs-controller-spec.png"
```

## この記事の出発点

APIの挙動をどのレイヤーで確認すべきか迷い、Request SpecとController Specが同じコントローラを二重にテストしているように見えた。実際には、通過する境界と保証する責務が異なる。

## 中心命題

Request Specはルーティングやミドルウェアを含むHTTP境界からの振る舞いを確認し、Controller Specはコントローラ単体に近い観測を行う。現代的なRails APIではRequest Specを中心にし、必要な局所テストだけを追加する。

## 必須構成

1. Request Specが通る経路：routing、middleware、authentication、controller、serialization
2. Controller Specが省略・差し替えやすい境界
3. HTTPステータス、ヘッダ、JSON、DB状態の確認
4. モデルバリデーションを全ケース再試験する必要はない理由
5. 認証・認可・ルーティングの失敗はRequest Specで見る
6. Controller Specが有効な局所例
7. System Specとの違い
8. 既存Controller Specを移行するときの判断

## 必須コード・検証

- 同じAPIをRequest SpecとController Specで書いた比較例
- Request Specで認証、ルーティング、JSONを確認
- モデル単体テストとの責務分離を示すテスト一覧

## 技術的に必ず守る事実

- RSpec Railsの推奨やAPIは利用バージョンで確認する
- テスト種別名より、実際に通る境界を理解する

## メリット・デメリットとして扱う点

- Request Spec: 信頼性が高い／セットアップと実行コストがやや高い
- Controller Spec: 局所的で速い／実経路との差が生まれやすい

## 避ける記述

- Controller Specは完全に不要と断定しない
- Request Specだけでモデルの全仕様を確認しようとしない

## 記事の結論

重複して見えるテストでも、異なる境界の契約を保証しているなら意味がある、とまとめる。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
