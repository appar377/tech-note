# Article 38: Rails、Dart、Swiftで異なる同一性と等価性

## メタデータ

```yaml
article_id: 38
title: "Rails、Dart、Swiftで異なる同一性と等価性"
slug: "identity-equality-ruby-dart-swift"
series: "Cross-stack"
tags:
  - ruby
  - dart
  - swift
  - identity
  - equality
output_path: "articles/38_identity-equality-ruby-dart-swift.md"
thumbnail: "/images/articles/identity-equality-ruby-dart-swift.png"
```

## この記事の出発点

Railsの同じDB行、Dartの`identical`、Swiftの`===`など、言語を跨ぐと「同じ」の意味が変わる。同じ値、同じ参照、同じ永続化IDを混同するとバグになる。

## 中心命題

各言語で参照同一性、値等価性、ハッシュ契約、永続化同一性を分け、ドメイン上どの「同じ」を必要としているか明示する。

## 必須構成

1. Ruby: `equal?`, `==`, `eql?`, `hash`
2. Active Record: 同じprimary keyでも別Rubyインスタンス
3. Dart: `identical`, `==`, `hashCode`
4. Swift: classの`===`, `Equatable`の`==`, value type
5. Hash/Set/Dictionary keyの契約
6. immutable Value Object
7. ORM entityとValue Object
8. UI identity

## 必須コード・検証

- 3言語で同値別インスタンスを比較
- Ruby Hash、Dart HashSet、Swift Setの小例
- DB同一行を2回loadするRails例

## 技術的に必ず守る事実

- Swiftの`===`はclass instance identityでありvalue typeには使わない
- Rubyの`eql?`/`hash`関係を正確に説明
- 言語版により細部を確認

## メリット・デメリットとして扱う点

- 値等価性: ドメイン表現に有効／mutable値で危険
- 参照同一性: 所有/共有確認／永続化同一性とは別

## 避ける記述

- 演算子を単純対応表にしない
- primary key一致だけで全ドメイン等価としない

## 記事の結論

「同じか？」という質問には、値・参照・DB identity・UI identityのどれかを必ず付ける。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
