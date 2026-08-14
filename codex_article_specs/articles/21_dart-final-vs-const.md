# Article 21: Dartのfinalとconstは何を固定しているのか

## メタデータ

```yaml
article_id: 21
title: "Dartのfinalとconstは何を固定しているのか"
slug: "dart-final-vs-const"
series: "Flutter / Dart"
tags:
  - dart
  - flutter
  - final
  - const
  - immutability
output_path: "articles/21_dart-final-vs-const.md"
thumbnail: "/images/articles/dart-final-vs-const.png"
```

## この記事の出発点

`final`も`const`も再代入できないため同じに見えたが、実行時に一度だけ決まる値と、コンパイル時に確定する定数では役割が異なる。さらに`final List`の中身は変更できるため、「変数が固定」と「オブジェクトが不変」も分ける必要があった。

## 中心命題

`final`は変数への再代入を禁止し、値は実行時に決まってよい。`const`はコンパイル時定数を要求し、constオブジェクト/コレクションは不変で、同値定数のcanonicalizationも起こり得る。

## 必須構成

1. `final`の一度だけ代入
2. `late final`の初期化と二重代入エラー
3. `const`式とconst constructor
4. `final List`と`const List`
5. 参照の固定とオブジェクトの不変性
6. Flutterでconst Widgetを使う意味
7. canonicalizationと`identical`の例
8. 無理にconst化しない判断

## 必須コード・検証

- `final now = DateTime.now()`とconst不可の例
- `final list = <int>[]; list.add(1)`
- `const list = <int>[]`の変更失敗
- const constructorを持つ小さなValue Object

## 技術的に必ず守る事実

- const Widgetが常に大幅な性能改善を保証すると断定しない
- constの可否は式全体がコンパイル時定数かで決まる

## メリット・デメリットとして扱う点

- `final`: 柔軟／深い不変性は保証しない
- `const`: 安全・共有可能／実行時値を使えない

## 避ける記述

- final=immutableと説明しない
- constを付ければあらゆる再ビルドがなくなると書かない

## 記事の結論

何を固定したいのかを、変数・参照・オブジェクト・生成時刻の4層で考える。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
