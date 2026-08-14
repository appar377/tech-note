# Article 39: with_lock、save、copyWith――短いメソッド名の裏にある複雑な動作

## メタデータ

```yaml
article_id: 39
title: "with_lock、save、copyWith――短いメソッド名の裏にある複雑な動作"
slug: "framework-api-abstraction-leaks"
series: "Cross-stack"
tags:
  - abstraction
  - frameworks
  - with-lock
  - save
  - copywith
output_path: "articles/39_framework-api-abstraction-leaks.md"
thumbnail: "/images/articles/framework-api-abstraction-leaks.png"
```

## この記事の出発点

`with_lock`は囲むだけ、`save`は保存するだけ、`copyWith`はコピーするだけに見える。しかし実際にはreload、I/O、transaction、instance生成、null semanticsなどの副作用が隠れる。

## 中心命題

便利なAPIは複雑さを削除するのではなく、通常経路から隠す。障害調査では、戻り値、状態変更、I/O、ライフサイクル、例外、並行性の6点で抽象化を開く。

## 必須構成

1. `with_lock`: transaction/row lock/reload
2. Repository `save`: create/update/network
3. `copyWith`: 新instanceとnull semantics
4. `deleteAll`: 保存領域の広すぎる削除
5. `CancelToken`: client側だけのcancel
6. Scope名: Relation/件数
7. 抽象化漏れが起きる兆候
8. 公式実装・生成SQL・ログを読む手順
9. APIレビュー用チェックリスト

## 必須コード・検証

- 各APIを1つずつ最小コードで示す
- 副作用チェックリストのMarkdown表
- wrapper APIで契約を狭める例

## 技術的に必ず守る事実

- 抽象化漏れは必ずしも設計欠陥ではない
- 内部実装依存と公開契約を区別する

## メリット・デメリットとして扱う点

- 高レベルAPI: 生産性／障害時に内部理解が必要
- 低レベル直接操作: 制御／重複と誤用

## 避ける記述

- フレームワークを使わない方がよいという結論にしない
- 内部実装の偶然を公開契約として扱わない

## 記事の結論

API名から動作を推測せず、状態と境界を観測する習慣を持つ。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
