# Article 01: Railsのwith_lockでDirty Trackingが消え、after_commitが発火しなくなった理由

## メタデータ

```yaml
article_id: 01
title: "Railsのwith_lockでDirty Trackingが消え、after_commitが発火しなくなった理由"
slug: "with-lock-dirty-tracking-after-commit"
series: "Rails / 障害解析"
tags:
  - rails
  - active-record
  - dirty-tracking
  - with-lock
  - after-commit
output_path: "articles/01_with-lock-dirty-tracking-after-commit.md"
thumbnail: "/images/articles/with-lock-dirty-tracking-after-commit.png"
```

## この記事の出発点

モデル更新後に同じインスタンスへ`with_lock`を追加したところ、外部連携ジョブを作成する`after_commit`が期待通り動かなくなった。更新自体はDBへ反映されているため、最初はコールバック条件ではなくジョブ基盤を疑った。実際には、外側のトランザクションがコミットする前に`with_lock`内部の再読み込みが走り、保存後の変更情報を保持していたインスタンス状態が失われていた。

## 中心命題

問題の本質は`with_lock`そのものではなく、「Dirty TrackingというRubyオブジェクト内の一時状態に依存したコールバック」と「同じオブジェクトをreloadするロック処理」を、同一トランザクション内で組み合わせたことである。

## 必須構成

1. 障害の症状：DB更新は成功するのにジョブだけ作られない
2. 当初疑った箇所：Active Job、キュー、コールバック登録、トランザクション
3. `saved_change_to_status?`を更新直後・`with_lock`前後・`after_commit`内で観測する
4. `with_lock`→`lock!`→ロック付きreloadという流れを説明する
5. 外側のトランザクションがある場合、`after_commit`が最後まで遅延することを示す
6. なぜ保存済み変更情報がDB履歴ではなくインスタンス状態なのか
7. 修正案：ロック取得後に更新、変更値を明示的に保持、コールバックをやめてサービス層から明示実行、Outbox
8. 再現RSpecと、修正後にジョブが1回だけ作られるテスト

## 必須コード・検証

- Ruby: `User.transaction { user.update!(status: :active); user.with_lock { ... } }`
- `saved_changes`と`saved_change_to_status?`を各地点で出力する再現コード
- SQLログとして`SELECT ... FOR UPDATE`を示す
- RSpec: `after_commit`条件がreloadで変わることを検証する

## 技術的に必ず守る事実

- `with_lock`はトランザクション内で悲観的ロックを取得する
- 利用中Railsバージョンの`lock!`実装を確認し、reload挙動を引用ではなく要約する
- Dirty Trackingの保存後情報は同じRubyインスタンスに保持され、reloadで再構築される
- コールバックの発火タイミングはトランザクション境界に依存する

## メリット・デメリットとして扱う点

- コールバック維持: 変更量は小さいが、副作用の発生源が見えにくい
- サービス層で明示実行: 制御しやすいが、呼び出し漏れを防ぐ設計が必要
- Outbox: 信頼性が高いが、テーブル・ワーカー・冪等性管理が増える

## 避ける記述

- `with_lock`を使うと常に`after_commit`が動かない、と一般化しない
- 実在しないRails内部コードや障害件数を作らない
- `after_commit`を全面否定しない

## 記事の結論

「変更の事実」と「変更を覚えているオブジェクト」は別物であり、状態依存のAPIを使うときは、その状態を消す操作を同じフローに置かない、という原則で締める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
