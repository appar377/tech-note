# Article 18: highest_price_firstは「最高値1件」なのか「価格降順」なのか

## メタデータ

```yaml
article_id: 18
title: "highest_price_firstは「最高値1件」なのか「価格降順」なのか"
slug: "active-record-scope-naming"
series: "Rails / Code Review"
tags:
  - rails
  - active-record
  - scope
  - naming
output_path: "articles/18_active-record-scope-naming.md"
thumbnail: "/images/articles/active-record-scope-naming.png"
```

## この記事の出発点

`scope :highest_price_first, -> { order(price: :desc, created_at: :desc, id: :desc) }`を読んだとき、1件を返すのか全件を並べるのか迷った。実装は正しくても、名前が戻り値の契約を曖昧にしていた。

## 中心命題

Relation全体を返すScopeは、集合と順序を表す名前にする。単一レコードを返すメソッドとは命名とAPIを分け、呼び出し側が戻り値を予測できるようにする。

## 必須構成

1. `highest`と`first`が単一値を連想させる理由
2. ScopeはRelationを返す契約
3. `expensive_first`、`order_by_price_desc`等の候補
4. 単一レコードなら`highest_priced`等のメソッド
5. 同額時のtie-breaker
6. scope chainingと再利用性
7. 名前変更の移行とテスト

## 必須コード・検証

- 曖昧なscopeと改善後を比較
- Relationであること、順序、同額時順序をRSpecで確認

## 技術的に必ず守る事実

- 命名に唯一の正解はないが、戻り値と副作用を予測できることが重要
- Scopeに`first`を含めても必ず誤りではないが、チーム規約を明示する

## メリット・デメリットとして扱う点

- 具体的命名: 長くなる／誤解が減る
- 短い命名: 書きやすい／文脈依存

## 避ける記述

- 特定の名前だけを絶対正解としない
- SQL順序に一意性がなければ結果が安定すると断定しない

## 記事の結論

名前はコメントではなく呼び出し側との契約であり、型と件数まで予測できる語彙を選ぶ。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
