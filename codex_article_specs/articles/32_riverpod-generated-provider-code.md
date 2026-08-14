# Article 32: providers.dartとproviders.g.dartはどうつながっているのか

## メタデータ

```yaml
article_id: 32
title: "providers.dartとproviders.g.dartはどうつながっているのか"
slug: "riverpod-generated-provider-code"
series: "Flutter / Riverpod"
tags:
  - flutter
  - riverpod
  - code-generation
  - build-runner
output_path: "articles/32_riverpod-generated-provider-code.md"
thumbnail: "/images/articles/riverpod-generated-provider-code.png"
```

## この記事の出発点

`@riverpod`を書いたファイルと、自動生成された`.g.dart`の関係が分からず、どちらが実行されるコードなのか混乱した。

## 中心命題

手書き関数/Notifierがproviderの定義元で、generatorは型安全なProviderオブジェクト、hash、ref型などの接着コードを生成する。生成物は直接編集せず、annotationとbuild設定を管理する。

## 必須構成

1. `part 'providers.g.dart';`
2. `@riverpod`が対象を示す
3. 生成されるProviderオブジェクト
4. 関数名とprovider名の対応
5. autoDisposeとkeepAlive
6. family引数
7. `build_runner`の実行とwatch
8. 生成差分をcommitする方針
9. testでoverrideする方法

## 必須コード・検証

- 関数providerとclass Notifierの2例
- 生成前後の概念図
- `ProviderScope(overrides: ...)` test
- 生成ファイルを編集して再生成で消える例は説明のみ

## 技術的に必ず守る事実

- Riverpod generator APIはメジャーバージョンで変わるためpubspecを確認
- 生成物の全行を解説せず責務に集中する

## メリット・デメリットとして扱う点

- codegen: 型安全・boilerplate削減／build時間・生成規約への依存
- 手書きProvider: 明示的／定型コード

## 避ける記述

- 生成コードを魔法とだけ表現しない
- 古いannotation/Ref型を現行版へ混ぜない

## 記事の結論

コード生成はロジックを生成するというより、宣言とランタイムAPIの接着層を自動化していると理解する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
