# Article 17: RailsエンジニアがSQLを避けられない理由

## メタデータ

```yaml
article_id: 17
title: "RailsエンジニアがSQLを避けられない理由"
slug: "rails-engineer-needs-sql"
series: "Rails / SQL"
tags:
  - rails
  - sql
  - active-record
  - database
  - performance
output_path: "articles/17_rails-engineer-needs-sql.md"
thumbnail: "/images/articles/rails-engineer-needs-sql.png"
```

## この記事の出発点

Active Recordだけで機能を実装できても、遅いクエリ、重複、ロック、集計、N+1を調べる段階ではSQLとDB実行計画が必要になった。

## 中心命題

Active RecordはSQLを消すのではなく生成する抽象化である。抽象化を使い続けるためにも、生成SQL、インデックス、実行計画、ロックを読める必要がある。

## 必須構成

1. Active Recordが提供する生産性
2. 生成SQLをログで確認する
3. N+1と`includes`/`preload`/`eager_load`の違いをバージョンに合わせて説明
4. Indexが効く条件
5. `EXPLAIN`/`EXPLAIN ANALYZE`の読み方の入口
6. GROUP BY、CTE、Window Function
7. UPSERTと一括処理
8. トランザクション・ロック
9. SQLを直接書く判断基準

## 必須コード・検証

- 同じActive Recordクエリの生成SQL
- N+1のログ比較
- インデックス追加前後の実行計画例は架空値で断定せず、サンプルとして明示
- CTEまたはWindow Functionを1例

## 技術的に必ず守る事実

- 性能はデータ量・分布・DB設定で変わる
- `EXPLAIN ANALYZE`は実行を伴うことがあるため本番利用に注意

## メリット・デメリットとして扱う点

- Active Record中心: 可読性・保守性／高度なSQLで限界
- 生SQL: 表現力・性能制御／移植性と安全なbindが必要

## 避ける記述

- SQLを知れば常に生SQLを書くべき、としない
- インデックスを増やせば速くなると単純化しない

## 記事の結論

抽象化を捨てるためではなく、抽象化のコストと限界を判断するためにSQLを学ぶ、とまとめる。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
