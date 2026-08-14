# Article 27: GETとPUTを文字列で分岐せず、Dartのsealed classで表現する

## メタデータ

```yaml
article_id: 27
title: "GETとPUTを文字列で分岐せず、Dartのsealed classで表現する"
slug: "dart-sealed-class-exhaustive-switch-api"
series: "Flutter / Dart"
tags:
  - dart
  - sealed-class
  - pattern-matching
  - api-design
output_path: "articles/27_dart-sealed-class-exhaustive-switch-api.md"
thumbnail: "/images/articles/dart-sealed-class-exhaustive-switch-api.png"
```

## この記事の出発点

Presigned URLへのGET/PUT処理を文字列やbooleanで切り替えると、必要データの違いと不正組み合わせを表現しやすい。

## 中心命題

各操作を異なるsubtypeとして表現し、sealed基底型に対する網羅的switchでdispatchする。不正状態を実行時チェックではなく型で表現不能にする。

## 必須構成

1. 文字列method分岐の問題
2. enumで足りる場合と、各caseが別データを持つ場合
3. `sealed class S3Request<T>`
4. `GetRequest`と`PutRequest`
5. pattern matchingとexhaustiveness
6. private subtype/constructor
7. generic戻り値設計
8. ケース追加時にコンパイルエラーで気づく利点

## 必須コード・検証

- Dart 3に合わせたsealed classコード
- `switch (request)`でGET/PUTを処理
- 不正method文字列が存在しないことを示すtest

## 技術的に必ず守る事実

- Dart/Flutterの実際の言語バージョンを確認
- sealedは同一library内のsubtyping制約を含むため正確に説明

## メリット・デメリットとして扱う点

- sealed union: 型安全／型数が増える
- enum+data: 単純／case固有データの不整合を許しやすい

## 避ける記述

- 文字列分岐をすべてsealedへ置き換えるとしない
- 存在しない構文を生成しない

## 記事の結論

分岐条件をデータとして持つより、許される操作を型として定義する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
