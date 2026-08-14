# Article 03: Railsのlock!とwith_lockを、SQLのSELECT FOR UPDATEから理解する

## メタデータ

```yaml
article_id: 03
title: "Railsのlock!とwith_lockを、SQLのSELECT FOR UPDATEから理解する"
slug: "rails-pessimistic-locking-select-for-update"
series: "Rails / Database"
tags:
  - rails
  - sql
  - pessimistic-locking
  - transactions
output_path: "articles/03_rails-pessimistic-locking-select-for-update.md"
thumbnail: "/images/articles/rails-pessimistic-locking-select-for-update.png"
```

## この記事の出発点

`with_lock`をRubyの排他制御のように捉えていたため、何をロックし、いつ解放され、別プロセスへどう効くのかが曖昧だった。SQLへ降りて考えることで、行ロックの範囲と限界が明確になった。

## 中心命題

`lock!`と`with_lock`はDBトランザクション上の悲観的ロックを扱うAPIであり、プロセス内Mutexではない。守れるのは、対象DBとトランザクションが提供するロック範囲だけである。

## 必須構成

1. 悲観的ロックと楽観的ロックの違い
2. `lock!`と`with_lock`の呼び出し形
3. 生成される`SELECT ... FOR UPDATE`
4. ロック保持期間はトランザクション終了まで
5. 別プロセス・別Podからも同じDB行に効く理由
6. 対象行が存在しない場合に何を守れないか
7. ロック順序が違うとデッドロックになる例
8. 外部APIやS3処理をロック内に置く危険性
9. DB製品・分離レベルによる差

## 必須コード・検証

- 2スレッド/2接続で同じ行を更新する最小再現
- SQLログ
- デッドロックを避けるためID順でロックする例
- タイムアウトをテストする際は`sleep`依存を避け、同期プリミティブを使う

## 技術的に必ず守る事実

- 行ロックはDB接続とトランザクションに紐づく
- Rubyのスレッドロックとは別物
- ロック句や挙動はPostgreSQL/MySQL等で差がある

## メリット・デメリットとして扱う点

- 悲観的ロック: 競合を直列化しやすいが、待機・デッドロック・スループット低下
- 楽観的ロック: 競合が少ない場合に効率的だが、リトライ設計が必要

## 避ける記述

- ロックすればすべての競合が解決すると書かない
- DB製品差を無視しない
- 長時間トランザクションを例として推奨しない

## 記事の結論

ロックAPIを選ぶ前に「どの資源を、どの接続が、いつまで守るか」をSQLレベルで説明できる状態を目標にする。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
