# Article 26: Dartの同一性と等価性――identical、==、hashCode、Equatable

## メタデータ

```yaml
article_id: 26
title: "Dartの同一性と等価性――identical、==、hashCode、Equatable"
slug: "dart-identity-equality-hashcode-equatable"
series: "Flutter / Dart"
tags:
  - dart
  - identity
  - equality
  - hashcode
  - equatable
output_path: "articles/26_dart-identity-equality-hashcode-equatable.md"
thumbnail: "/images/articles/dart-identity-equality-hashcode-equatable.png"
```

## この記事の出発点

同じフィールド値を持つ2インスタンスが`==`でfalseになり、Equatableを入れれば解決すると思った。ところがmutableな値やListを含むと、Set/Mapの挙動まで影響する。

## 中心命題

`identical`は同一オブジェクト参照、`==`は型が定義する値等価性、`hashCode`はハッシュコレクションとの契約である。Equatableは値等価性の実装補助であり、不変性や深いコレクション比較を自動的に万能化するものではない。

## 必須構成

1. デフォルトObjectの`==`
2. `identical`との違い
3. `operator ==`と`hashCode`の契約
4. 等価ならhashCodeも同じにする必要
5. HashSet/Map keyでmutable objectを使う危険
6. Equatableの`props`
7. List/Mapの深い等価性
8. Freezed/recordとの比較

## 必須コード・検証

- 同値2インスタンスの例
- hashCode不整合でSet検索が壊れる悪い例
- Equatable Value Object
- mutable fieldを変更した後のHashSet test

## 技術的に必ず守る事実

- `identical`と`==`の結果はconst canonicalization等で変わり得る
- 等価性はドメイン定義で決める

## メリット・デメリットとして扱う点

- Equatable: boilerplate削減／props漏れ、mutable値の危険
- 手書き: 明示的／実装量とミス

## 避ける記述

- Equatableを付ければimmutableになると書かない
- hashCodeの具体値が実行間で固定と仮定しない

## 記事の結論

等価性は便利メソッドではなく、コレクション・状態比較・UI更新へ影響するドメイン契約である。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
