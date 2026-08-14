# Article 20: DartのFutureとasyncとawaitを混同していた

## メタデータ

```yaml
article_id: 20
title: "DartのFutureとasyncとawaitを混同していた"
slug: "dart-future-async-await"
series: "Flutter / Dart"
tags:
  - dart
  - flutter
  - future
  - async
  - await
output_path: "articles/20_dart-future-async-await.md"
thumbnail: "/images/articles/dart-future-async-await.png"
```

## この記事の出発点

interfaceに`Future<String?> readRefreshToken();`と書かれているのに`await`がなく、なぜ非同期なのか分からなかった。戻り値の型、実装側の修飾子、呼び出し側の待機構文を同じものとして捉えていた。

## 中心命題

`Future<T>`は将来得られる値を表す型、`async`は関数本体を非同期に書くための修飾子、`await`はFutureの完了まで現在のasync関数を一時停止する式である。宣言・実装・呼び出しを分けて理解する。

## 必須構成

1. interface/abstract methodは実装を持たないため`async`不要
2. `Future<T>`を返す同期的な関数宣言
3. `async`関数が返り値をFutureで包むこと
4. 呼び出し側の`await`
5. Futureをそのままreturnする場合
6. `return await`が必要になるtry/catch等の文脈
7. エラーがFutureとして伝播する仕組み
8. 並列実行と直列awaitの違い

## 必須コード・検証

- `Future<String?> read()`のinterfaceと実装
- `return storage.read(...)`と`return await storage.read(...)`比較
- `Future.wait`で並列化する例
- エラー伝播のunit test

## 技術的に必ず守る事実

- `await`はスレッドをブロックする説明にしない
- `async`を付けるだけで別スレッド実行になるわけではない
- イベントループ/Isolateの詳細へ必要以上に広げない

## メリット・デメリットとして扱う点

- Futureを直接返す: 簡潔・スタックが明確／局所try-catchしにくい
- `async/await`: 読みやすい／不要なasyncは層を増やす

## 避ける記述

- 非同期=並列と書かない
- `await`がUIスレッドを物理的に停止すると説明しない

## 記事の結論

型、関数の書き方、待ち方を分離すると、非同期コードの責務が読めるようになる、とまとめる。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
