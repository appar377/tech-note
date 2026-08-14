# Article 09: type_for_attribute(:price).castから理解するActive Recordの型変換

## メタデータ

```yaml
article_id: 09
title: "type_for_attribute(:price).castから理解するActive Recordの型変換"
slug: "active-record-type-casting"
series: "Rails / Active Record"
tags:
  - rails
  - active-record
  - type-casting
  - active-model
output_path: "articles/09_active-record-type-casting.md"
thumbnail: "/images/articles/active-record-type-casting.png"
```

## この記事の出発点

HTTPパラメータは文字列なのに、モデルへ代入すると整数や日付として扱える。`type_for_attribute(:price).cast`を見たことで、型変換がどの層で起きるかを理解する必要が出てきた。

## 中心命題

Active Recordの型システムは、ユーザー入力をRuby値へ変換する`cast`、DB表現へ変換する`serialize`、DB値をRubyへ戻す`deserialize`を分けて扱う。

## 必須構成

1. HTTPパラメータが基本的に文字列であること
2. モデル属性へ代入したときの型変換
3. `type_for_attribute`が返すTypeオブジェクト
4. `cast`、`serialize`、`deserialize`の責務
5. 空文字、nil、真偽値、decimal、dateの例
6. 浮動小数点を金額に使う危険性
7. カスタム型を定義する場合
8. Strong Parametersは型変換機構ではないこと

## 必須コード・検証

- `User.type_for_attribute(:age).cast('42')`
- decimal/date/booleanのコンソール例
- カスタム`ActiveModel::Type::Value`の小さな例
- 境界値のRSpec

## 技術的に必ず守る事実

- 変換結果はカラム型・利用バージョン・アダプタで確認する
- `cast`は入力値の妥当性検証と同義ではない
- decimalはFloatではなくDecimal系型を意識する

## メリット・デメリットとして扱う点

- モデルへ代入して任せる: 一貫性／モデル生成が必要
- Type APIを直接使う: モデル外でも再利用／内部API依存を意識

## 避ける記述

- castすれば不正入力が安全になると書かない
- 全DBアダプタで完全に同じ挙動と断定しない

## 記事の結論

型変換は魔法ではなく境界変換のパイプラインであり、変換と検証を分けて設計する、とまとめる。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
