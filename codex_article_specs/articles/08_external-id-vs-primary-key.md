# Article 08: 外部CSVのIDとDBの主キーを混同しない――外部識別子の設計

## メタデータ

```yaml
article_id: 08
title: "外部CSVのIDとDBの主キーを混同しない――外部識別子の設計"
slug: "external-id-vs-primary-key"
series: "Rails / Data Modeling"
tags:
  - rails
  - database-design
  - external-id
  - primary-key
output_path: "articles/08_external-id-vs-primary-key.md"
thumbnail: "/images/articles/external-id-vs-primary-key.png"
```

## この記事の出発点

CSVのID列をそのままDBの`id`へ設定すれば簡単に見えるが、別システムの番号体系、再採番、複数データソース、内部参照との衝突を招く。

## 中心命題

DB内部のsurrogate keyと、業務・外部システムが提供するnatural/external keyは責務が違う。`source + external_id`を明示的に持ち、変換境界を設計する。

## 必須構成

1. 内部主キーと業務識別子の役割
2. 外部システムが複数ある場合の衝突
3. 番号の再利用・変更・欠損
4. `external_id`単独ではなく`source`との複合一意制約
5. 外部ID変更履歴や別名テーブルが必要なケース
6. APIレスポンスで内部IDを露出するか
7. インポートの冪等キーとして使う方法

## 必須コード・検証

- migration: `source`, `external_id`, unique index
- Importerで外部IDから内部レコードを解決する例
- 同じexternal_idでもsourceが違えば別レコードになるテスト

## 技術的に必ず守る事実

- surrogate keyとnatural keyは排他的な思想ではなく併用できる
- 一意性はDB制約で保証する

## メリット・デメリットとして扱う点

- 外部IDを直接PK: マッピングが不要／外部都合が内部設計へ侵入
- 別カラムで保持: 柔軟／解決処理と索引が必要

## 避ける記述

- 外部IDは絶対に変わらないと断定しない
- UUIDならすべて解決すると書かない

## 記事の結論

識別子は値そのものより「どの境界で、誰が、その一意性を保証するか」が重要だと一般化する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
