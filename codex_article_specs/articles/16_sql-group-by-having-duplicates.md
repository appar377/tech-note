# Article 16: GROUP BYとHAVINGで重複データを検出する

## メタデータ

```yaml
article_id: 16
title: "GROUP BYとHAVINGで重複データを検出する"
slug: "sql-group-by-having-duplicates"
series: "Rails / SQL"
tags:
  - sql
  - group-by
  - having
  - duplicates
  - rails
output_path: "articles/16_sql-group-by-having-duplicates.md"
thumbnail: "/images/articles/sql-group-by-having-duplicates.png"
```

## この記事の出発点

メーカー名、発売日、車種IDなど、同じ値の組み合わせを持つレコードを調べる必要があった。Rubyで全件読み込むのではなく、DBの集約機能で候補を絞る。

## 中心命題

重複検出は`GROUP BY`で同じキーをまとめ、`HAVING COUNT(*) > 1`で複数件のグループだけを残す。検出後は実レコード取得と再発防止の一意制約まで設計する。

## 必須構成

1. 単一カラムの重複
2. 複合キーの重複
3. `WHERE`と`HAVING`の役割差
4. NULLを含む場合のグルーピング
5. 重複グループだけでなく実レコードを取るCTE/JOIN
6. どのレコードを残すかの決定
7. 削除前のバックアップとDry Run
8. UNIQUE INDEXで再発防止

## 必須コード・検証

- SQL: `GROUP BY name, released_on, car_model_id HAVING COUNT(*) > 1`
- Active Recordの`group(...).having(...)`
- CTEで重複行を展開する例
- unique index migrationと既存重複の失敗テスト

## 技術的に必ず守る事実

- `COUNT(*)`と`COUNT(column)`はNULLの扱いが異なる
- DBごとのNULL一意制約挙動を確認する

## メリット・デメリットとして扱う点

- SQL集約: 高速でDB向き／複雑な正規化ルールは前処理が必要
- アプリ処理: 柔軟／メモリと転送コスト

## 避ける記述

- 検出SQLをそのまま削除SQLへ変えない
- 重複の業務定義を決めずに一意制約を貼らない

## 記事の結論

重複検出は掃除ではなく、データモデルが本来持つ一意性を見つけ直す作業だと締める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
