# Article 25: DartのcopyWithでnullを正しく扱うためのSentinel Pattern

## メタデータ

```yaml
article_id: 25
title: "DartのcopyWithでnullを正しく扱うためのSentinel Pattern"
slug: "dart-copywith-sentinel-pattern"
series: "Flutter / Dart"
tags:
  - dart
  - copywith
  - null-safety
  - sentinel-pattern
  - immutability
output_path: "articles/25_dart-copywith-sentinel-pattern.md"
thumbnail: "/images/articles/dart-copywith-sentinel-pattern.png"
```

## この記事の出発点

`copyWith({String? name})`では、引数未指定と`name: null`を区別できない。nullable属性を明示的にnullへ戻す更新ができず、APIの意味が曖昧になった。

## 中心命題

引数の既定値に一意なsentinelオブジェクトを使い、「未指定」「明示null」「非null値」の3状態を表現する。あるいは更新値を型で包む。

## 必須構成

1. 通常のnullable引数で区別できない理由
2. private/static sentinelの定義
3. `identical(next, sentinel)`
4. ジェネリックhelperの型安全性
5. 明示nullを代入するケース
6. Freezed等のコード生成が提供する解決
7. `Option<T>`/sealed wrapperによる代案
8. copyWith引数が増えすぎたときの設計見直し

## 必須コード・検証

- `static const _sentinel = Object()`または一意オブジェクト
- `Object? name = _sentinel`を使うcopyWith
- 未指定/null/値の3テスト
- sealed `Update<T>`代案

## 技術的に必ず守る事実

- const sentinelの同一性が意図通りか利用方法を正確に書く
- public APIで危険なcastを隠さない

## メリット・デメリットとして扱う点

- Sentinel: 軽量／型が読みづらくcastが必要
- Wrapper型: 明示的・型安全／呼び出しが冗長
- コード生成: 利便性／生成規約への依存

## 避ける記述

- `null`を「変更なし」と固定してしまわない
- 同値オブジェクトをsentinelとして比較しない

## 記事の結論

nullableな更新APIでは、値の型だけでなく「操作の有無」も型またはsentinelで表現する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
