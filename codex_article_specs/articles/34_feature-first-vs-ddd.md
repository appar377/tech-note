# Article 34: FlutterのFeature-first構成とDDDを混同していた

## メタデータ

```yaml
article_id: 34
title: "FlutterのFeature-first構成とDDDを混同していた"
slug: "feature-first-vs-ddd"
series: "Flutter / Architecture"
tags:
  - flutter
  - feature-first
  - ddd
  - architecture
  - folder-structure
output_path: "articles/34_feature-first-vs-ddd.md"
thumbnail: "/images/articles/feature-first-vs-ddd.png"
```

## この記事の出発点

feature単位のディレクトリ構成をDDDと呼んでよいのか迷った。実際には、ファイル配置の軸と、ドメインモデル/境界づけられたコンテキストを考える手法は別だった。

## 中心命題

Feature-firstはコードを機能単位に近接配置する構成戦略、DDDは複雑な業務知識をモデル化し境界を定義する設計思想である。併用できるが同義ではない。

## 必須構成

1. layer-firstとfeature-first
2. feature内のpresentation/application/domain/infrastructure
3. DDDのEntity、Value Object、Aggregate、Domain Serviceを必要な範囲だけ
4. Bounded Contextと単なる画面featureの違い
5. `shared`肥大化
6. feature間依存の向き
7. 小規模CRUDでDDDを入れるコスト
8. 成長に合わせて段階導入する基準

## 必須コード・検証

- 小規模feature-firstディレクトリ例
- DDDを併用したfeature構造
- 禁止依存をlint/architecture testで確認する案

## 技術的に必ず守る事実

- DDDをフォルダ名のセットとして説明しない
- すべてのFlutterアプリにdomain層が必要としない

## メリット・デメリットとして扱う点

- Feature-first: 変更の局所性／横断共有の設計が必要
- DDD: 業務複雑性に強い／学習・実装コスト

## 避ける記述

- Clean Architecture、DDD、Feature-firstを同一視しない
- 層を増やすことを設計品質と見なさない

## 記事の結論

ディレクトリ構造は変更単位を表し、DDDは業務の意味境界を表す。解く問題が違う。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
