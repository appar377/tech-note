# Rails・Flutter・Swift 実務記事シリーズ — Codex執筆仕様

このディレクトリは、40本の記事をCodexに執筆させるためのマスター仕様である。
一般的な入門解説ではなく、実際に詰まった点、誤解、障害調査、設計判断、再発防止を中心に書く。

## 1. 執筆目的

- 読者が「同じ箇所で詰まったときに、原因を切り分けられる」記事にする。
- APIの表面的な使い方だけでなく、状態・ライフサイクル・トランザクション・非同期処理・オブジェクト同一性まで説明する。
- 最終的な正解だけでなく、当初の誤解と、どの観測から誤解を修正したかを残す。
- Rails、Flutter、Swiftの経験を実際以上に脚色しない。架空の障害規模、架空の会社名、架空の数値を作らない。

## 2. 想定読者

- Rails、Flutter、Swiftの基礎構文は知っているエンジニア。
- フレームワークのAPIは使えるが、内部の実行モデルで詰まり始めた層。
- 実務で保守、障害調査、テスト設計、認証、データ整合性に関わる人。

## 3. 文体

- 日本語。
- 一人称の実体験ベース。「当時は〜と理解していた」「ログを見ると〜だった」の形を使う。
- 感情的な煽り、過剰な成功談、根拠のない断定は避ける。
- 技術用語はそのまま使い、必要な箇所だけ定義する。
- 「初心者でも簡単」「これだけで完璧」などの表現は禁止。
- 同じ意味の説明を繰り返さず、観測事実 → 原因 → 修正 → 一般化の順で書く。

## 4. 1記事の標準構成

1. タイトル
2. リード
   - 何が起きたか
   - なぜ直感に反したか
   - 読了後に何が分かるか
3. 発生した状況
4. 当初の理解・誤解
5. 最小再現コード
6. 内部で起きていたこと
7. 調査手順
   - ログ
   - SQL
   - 状態の観測
   - 再現テスト
8. 修正案の比較
9. 採用した考え方
10. 再発防止テスト
11. メリット・デメリット
12. 一般化できる設計原則
13. まとめ

記事によって不要な節は統合してよいが、「誤解」「内部動作」「修正比較」「再発防止」は原則として残す。

## 5. 出力形式

各記事はMarkdownで出力する。

```yaml
---
title: "記事タイトル"
slug: "kebab-case-slug"
series: "Rails / Flutter / Swift / Cross-stack"
tags:
  - tag1
  - tag2
description: "120文字以内の説明"
thumbnail: "/images/articles/<slug>.png"
---
```

本文では以下を守る。

- H1はfront matterのtitleと重複させない。本文はH2から開始する。
- コードブロックには言語を指定する。
- コードは最小再現を優先し、架空の巨大クラスを作らない。
- 実案件固有の名前は `User`、`Order`、`Employee`、`ImageRecord` などへ匿名化する。
- SQLが重要な記事では、Active Recordコードと生成SQLを併記する。
- 図が必要な場合はMermaidを使ってよい。ただし図だけで説明を済ませない。
- 1記事あたり目安3,000〜6,000字。障害解析記事は8,000字程度まで許容する。
- 公式仕様やバージョン差に依存する記述は、対象リポジトリのGemfile・pubspec.yaml・Package.swift等を確認して書く。
- リポジトリから確認できないバージョン固有の挙動は断定しない。

## 6. コード品質

- Rubyは現在のリポジトリのRubocop/Ruby/Rails設定に合わせる。
- Dartは`analysis_options.yaml`と利用中のDart/Flutter/Riverpod/Dio/GoRouterのバージョンに合わせる。
- Swiftは利用中のSwift言語モードとConcurrencyチェック設定に合わせる。
- サンプルには、成功ケースだけでなく失敗ケースまたは境界条件を最低1つ含める。
- テストコードを最低1つ含める。概念記事でも、最小の検証コードを入れる。
- `sleep`に依存する並行テスト、実環境のS3を破壊するサンプル、秘密情報の直書きは禁止。

## 7. 事実性

- 実体験として明示されていない数値・期間・障害件数を作らない。
- 「常に」「必ず」は、言語仕様または公式API契約で保証される場合だけ使う。
- DBロック、コールバック、認証トークン、Secure Storageなどは、脅威モデルやDB製品差を明記する。
- 用語の分類に複数流派がある場合は、その事実を短く注記する。
- 分からない点は推測で埋めず、本文中に「この挙動は利用バージョンで確認する」と書く。

## 8. シリーズ共通の価値

このシリーズの中心は「構文を知ること」ではなく、以下を追跡できるようになることである。

- 状態はどこに保持されるか
- いつ状態が消えるか
- どのトランザクションに属するか
- どこから副作用が発生するか
- 非同期処理の所有者は誰か
- 同じ値と同じオブジェクトはどう違うか
- フレームワークの抽象化がどこで漏れるか

# 全40記事の個別仕様


---

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

# Article 02: Rails Dirty TrackingをDBの変更履歴だと思っていた――実際にはいつ消えるのか

## メタデータ

```yaml
article_id: 02
title: "Rails Dirty TrackingをDBの変更履歴だと思っていた――実際にはいつ消えるのか"
slug: "active-record-dirty-tracking-lifecycle"
series: "Rails / Active Record"
tags:
  - rails
  - active-record
  - dirty-tracking
  - lifecycle
output_path: "articles/02_active-record-dirty-tracking-lifecycle.md"
thumbnail: "/images/articles/active-record-dirty-tracking-lifecycle.png"
```

## この記事の出発点

DB上で値が変わった事実は残っているのに、`saved_change_to_attribute?`や`previous_changes`が取れなくなる場面に遭遇した。Dirty Trackingを監査ログのような永続的履歴だと誤解していたことが混乱の原因だった。

## 中心命題

Dirty TrackingはDBの履歴ではなく、特定のActive Recordインスタンスが保存前後の差分を扱うためのライフサイクル依存APIである。保存前、保存直後、コミット後、reload後、別インスタンスで見える情報を分けて理解する必要がある。

## 必須構成

1. 同じDB行でもインスタンスが違えば変更情報を共有しないことを示す
2. 保存前：`changes_to_save`、`will_save_change_to_attribute?`
3. 保存後：`saved_changes`、`saved_change_to_attribute?`、`attribute_before_last_save`
4. `previous_changes`の位置づけと利用バージョンでの挙動確認
5. コミット後に何が残るか、外側トランザクションがある場合の注意
6. `reload`、再検索、別プロセスで情報が失われる理由
7. 監査履歴が必要ならPaperTrail相当の仕組みや独自履歴テーブルが必要なこと
8. 用途別のメソッド選択表

## 必須コード・検証

- 状態遷移ごとのRubyコンソール例
- `User.find(user.id)`で取り直した別インスタンスとの比較
- RSpecで保存前・保存後・reload後の値を検証

## 技術的に必ず守る事実

- Dirty TrackingはActive Model/Active Recordの変更検知機構
- 監査ログやDBトリガーの履歴とは役割が異なる
- メソッド名と利用可能なタイミングはRailsバージョン差があるためリポジトリで確認する

## メリット・デメリットとして扱う点

- Dirty Tracking利用: 実装が軽いが、ライフサイクルに強く依存する
- 履歴テーブル利用: 永続性があるが、保存量と設計コストが増える

## 避ける記述

- `changed?`など古い/文脈依存APIを無条件に推奨しない
- すべてのメソッドがafter_commitでも永続すると断定しない

## 記事の結論

「何が変わったか」だけでなく、「誰が、いつまで、その差分を覚えているか」を確認する習慣へ一般化する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

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

# Article 04: Railsのafter_commitは便利だが、業務フローの中心に置くと壊れやすい

## メタデータ

```yaml
article_id: 04
title: "Railsのafter_commitは便利だが、業務フローの中心に置くと壊れやすい"
slug: "after-commit-business-workflow"
series: "Rails / Architecture"
tags:
  - rails
  - callbacks
  - after-commit
  - outbox-pattern
output_path: "articles/04_after-commit-business-workflow.md"
thumbnail: "/images/articles/after-commit-business-workflow.png"
```

## この記事の出発点

モデル更新を起点にジョブ作成や外部連携を自動化するため、`after_commit`へ業務処理を集めた。呼び出し側が短くなる一方、どの更新が何を引き起こすか見えにくくなり、Dirty Trackingやトランザクション境界の影響を受けた。

## 中心命題

`after_commit`は「DB確定後に行う副作用」には適するが、重要な業務オーケストレーションの唯一の入口にすると暗黙性と再実行性が問題になる。重要度に応じて明示実行、冪等ジョブ、Outboxを使い分ける。

## 必須構成

1. `after_save`ではなく`after_commit`を選ぶ理由
2. 便利さ：ロールバックされた更新で副作用を起こしにくい
3. 危険性：発生源がモデル更新から見えない
4. 複数更新経路・一括更新・`update_columns`等との関係
5. Dirty Tracking条件とreloadの影響
6. ジョブ投入に成功して外部処理が失敗する場合
7. 明示的サービスオブジェクト案
8. Outbox Patternの最小構成
9. どの副作用ならコールバックに残してよいかの判断表

## 必須コード・検証

- コールバック実装とサービス層実装を並べる
- Outboxレコードを同じDBトランザクションで作る例
- 冪等キー付きジョブのRSpec

## 技術的に必ず守る事実

- `after_commit`はDBコミット後に実行されるが、外部システム成功までは保証しない
- コールバックをスキップする更新APIが存在する
- 非同期ジョブは少なくとも一度実行や重複実行を前提に設計する

## メリット・デメリットとして扱う点

- コールバック: 呼び出し側が簡潔、横断処理に便利／暗黙的、テストと追跡が難しい
- 明示実行: 可読性と制御性／呼び出し漏れ対策が必要
- Outbox: DBとの整合性／運用部品が増える

## 避ける記述

- `after_commit`は悪、と結論づけない
- Outboxを万能解として扱わない

## 記事の結論

副作用の重要度と失敗時の回復要件に応じて、暗黙性をどこまで許容するかを決める、という設計判断で締める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 05: S3にはあるがDBにはない、DBにはあるがS3にはない――整合性修復処理の設計

## メタデータ

```yaml
article_id: 05
title: "S3にはあるがDBにはない、DBにはあるがS3にはない――整合性修復処理の設計"
slug: "s3-db-consistency-reconciliation"
series: "Rails / Storage"
tags:
  - rails
  - aws-s3
  - data-consistency
  - batch
output_path: "articles/05_s3-db-consistency-reconciliation.md"
thumbnail: "/images/articles/s3-db-consistency-reconciliation.png"
```

## この記事の出発点

S3オブジェクトとDBレコードを突き合わせ、孤児ファイルと欠損レコードを検出・削除する保守処理が必要になった。単純な差集合だけでは、ページネーション、論理削除、競合、誤削除、再実行時の安全性が不足する。

## 中心命題

外部ストレージとの整合性修復は、一度だけ成功するスクリプトではなく、観測可能・冪等・段階的・再実行可能なバッチとして設計する。検出と削除を分離し、Dry Runと安全期間を持たせる。

## 必須構成

1. DB側をS3キーで索引化し、S3側キー集合と比較する基本
2. 論理削除済みレコードを含めるかの判断
3. S3 ListObjectsのページネーション
4. 孤児ファイルと欠損レコードの定義
5. 検出と削除を同じループで即実行しない理由
6. アップロード中・削除中との競合
7. 安全期間、タグ付け、隔離バケット、二段階削除
8. Dry Run、件数上限、監査ログ、メトリクス
9. 失敗後に再実行しても壊れない設計

## 必須コード・検証

- `Set`の差集合を使う最小例
- S3クライアントをFake化したテスト
- Dry Run結果の構造化ログ例
- 削除対象が閾値を超えたら停止するガード

## 技術的に必ず守る事実

- S3一覧APIはページングを考慮する
- DBとS3を同一ACIDトランザクションには含められない
- 現在のS3整合性仕様を古い知識で断定せず、公式仕様または利用環境を確認する

## メリット・デメリットとして扱う点

- 即時削除: コスト削減が早い／誤削除の影響が大きい
- 隔離後削除: 回復可能／一時的な保管コストと運用が増える

## 避ける記述

- 本番でいきなり削除するコードを完成形にしない
- S3一覧を1回で全件取れる前提にしない

## 記事の結論

整合性修復は「正しい集合を計算する処理」ではなく、「間違えても戻せる運用」を含む、と結論づける。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 06: DBトランザクションではS3をロールバックできない――外部ストレージを含む処理の設計

## メタデータ

```yaml
article_id: 06
title: "DBトランザクションではS3をロールバックできない――外部ストレージを含む処理の設計"
slug: "db-s3-transaction-boundary"
series: "Rails / Architecture"
tags:
  - rails
  - transactions
  - aws-s3
  - compensation
  - outbox
output_path: "articles/06_db-s3-transaction-boundary.md"
thumbnail: "/images/articles/db-s3-transaction-boundary.png"
```

## この記事の出発点

DBレコード作成とS3アップロードを1つの処理にまとめたとき、どちらかだけ成功する不整合が起き得る。`ActiveRecord::Base.transaction`で囲めば全体が戻るように見えるが、S3はそのトランザクションへ参加しない。

## 中心命題

ローカルDBトランザクションの境界を外部サービスまで拡張できない場合、状態遷移、冪等性、リトライ、補償処理、定期修復を組み合わせる。原子的成功を装うのではなく、中間状態を設計する。

## 必須構成

1. DB成功/S3失敗、S3成功/DB失敗の失敗行列
2. なぜDBロールバックでS3操作は戻らないか
3. アップロード先を一時キーにする案
4. `pending`→`available`→`failed`の状態遷移
5. Outbox/Inbox、非同期ワーカー、冪等キー
6. 補償トランザクションとしてのS3削除
7. 削除自体が失敗する場合
8. 整合性修復バッチとの組み合わせ

## 必須コード・検証

- 状態カラムを持つモデル例
- Outbox生成とワーカーの擬似コード
- 同じイベントを2回処理しても1つだけ確定するテスト

## 技術的に必ず守る事実

- ACIDの適用範囲は参加するDB資源に限られる
- 外部APIの成功/失敗とDBコミットは別の失敗ドメイン
- Exactly-onceを安易に主張せず、冪等なat-least-once処理を設計する

## メリット・デメリットとして扱う点

- 同期処理: 単純で即時性／失敗復旧とタイムアウトが難しい
- 非同期状態機械: 回復性／UI・運用・状態管理が複雑

## 避ける記述

- 分散トランザクションを導入すれば簡単に解決すると書かない
- 補償処理が必ず成功する前提にしない

## 記事の結論

「不整合をゼロに見せる」より「不整合状態を観測し、安全に収束させる」設計が現実的だとまとめる。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 07: Railsで冪等なCSVインポーターを作る――重複防止、更新、論理削除からの復活

## メタデータ

```yaml
article_id: 07
title: "Railsで冪等なCSVインポーターを作る――重複防止、更新、論理削除からの復活"
slug: "idempotent-csv-importer-rails"
series: "Rails / Batch"
tags:
  - rails
  - csv
  - idempotency
  - soft-delete
  - import
output_path: "articles/07_idempotent-csv-importer-rails.md"
thumbnail: "/images/articles/idempotent-csv-importer-rails.png"
```

## この記事の出発点

同じCSVを再投入しても重複を増やさず、社員番号をキーに後勝ち更新し、論理削除済みデータを復活させる必要があった。文字コード、外部キー解決、途中失敗、コールバックの扱いも同時に問題になる。

## 中心命題

CSVインポートの冪等性はアプリケーションコードだけでなく、業務キーの正規化、DB一意制約、更新戦略、エラー記録、再開位置まで含めて成立する。

## 必須構成

1. CSVの入力契約：ヘッダー、CP932/Shift-JIS、必須列
2. 社員番号などの業務キーを正規化する
3. DB一意制約を先に置く
4. 新規作成・更新・論理削除からの復活
5. ファイル内重複の後勝ち/先勝ちルール
6. 関連店舗名を外部キーへ解決する
7. 未解決参照と不正行の扱い
8. 全体ロールバックか行単位成功か
9. `upsert_all`と個別`save!`の比較
10. 結果サマリー、失敗CSV、再実行

## 必須コード・検証

- ImportRowの値オブジェクト
- 正規化→検証→検索/更新→結果記録のパイプライン
- 一意制約を含むmigration
- 同一ファイル2回実行、論理削除復活、文字コードのRSpec

## 技術的に必ず守る事実

- `upsert_all`は通常のモデルバリデーション/コールバックを通さない
- アプリケーション側の事前検索だけでは並行実行時の重複を防げない
- 外部入力のIDを内部主キーとして直接扱わない

## メリット・デメリットとして扱う点

- 行単位処理: 詳細なエラーを返しやすい／遅い
- 一括upsert: 高速／モデルロジックを迂回し、復活や関連解決が複雑

## 避ける記述

- CSVの値をそのまま信頼しない
- アプリの`find_or_create_by`だけで冪等性を保証したと書かない

## 記事の結論

冪等性とは「同じ入力なら同じ最終状態へ収束すること」であり、単に重複行を作らないことだけではない、と締める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

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

# Article 09: type_for_attribute(:price).castから理解するActive Recordの型変換

## メタデータ

```yaml
article_id: 09
title: "type_for_attribute(:price).castから理解するActive Recordの型変換"
slug: "active-record-type-casting"
series: "Rails / Active Record"
tags:
  - rails
  - active-record
  - type-casting
  - active-model
output_path: "articles/09_active-record-type-casting.md"
thumbnail: "/images/articles/active-record-type-casting.png"
```

## この記事の出発点

HTTPパラメータは文字列なのに、モデルへ代入すると整数や日付として扱える。`type_for_attribute(:price).cast`を見たことで、型変換がどの層で起きるかを理解する必要が出てきた。

## 中心命題

Active Recordの型システムは、ユーザー入力をRuby値へ変換する`cast`、DB表現へ変換する`serialize`、DB値をRubyへ戻す`deserialize`を分けて扱う。

## 必須構成

1. HTTPパラメータが基本的に文字列であること
2. モデル属性へ代入したときの型変換
3. `type_for_attribute`が返すTypeオブジェクト
4. `cast`、`serialize`、`deserialize`の責務
5. 空文字、nil、真偽値、decimal、dateの例
6. 浮動小数点を金額に使う危険性
7. カスタム型を定義する場合
8. Strong Parametersは型変換機構ではないこと

## 必須コード・検証

- `User.type_for_attribute(:age).cast('42')`
- decimal/date/booleanのコンソール例
- カスタム`ActiveModel::Type::Value`の小さな例
- 境界値のRSpec

## 技術的に必ず守る事実

- 変換結果はカラム型・利用バージョン・アダプタで確認する
- `cast`は入力値の妥当性検証と同義ではない
- decimalはFloatではなくDecimal系型を意識する

## メリット・デメリットとして扱う点

- モデルへ代入して任せる: 一貫性／モデル生成が必要
- Type APIを直接使う: モデル外でも再利用／内部API依存を意識

## 避ける記述

- castすれば不正入力が安全になると書かない
- 全DBアダプタで完全に同じ挙動と断定しない

## 記事の結論

型変換は魔法ではなく境界変換のパイプラインであり、変換と検証を分けて設計する、とまとめる。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 10: Railsのquery_parameters.to_unsafe_hを安易に使ってはいけない理由

## メタデータ

```yaml
article_id: 10
title: "Railsのquery_parameters.to_unsafe_hを安易に使ってはいけない理由"
slug: "rails-to-unsafe-h-strong-parameters"
series: "Rails / Security"
tags:
  - rails
  - strong-parameters
  - security
  - to-unsafe-h
output_path: "articles/10_rails-to-unsafe-h-strong-parameters.md"
thumbnail: "/images/articles/rails-to-unsafe-h-strong-parameters.png"
```

## この記事の出発点

検索条件をHashへ変換するため`to_unsafe_h`を使うコードを見た。GETパラメータだから安全に見えるが、許可していないキーをすべて通常Hashへ落とすため、後段でMass Assignmentや動的条件へ流すと境界が崩れる。

## 中心命題

`to_unsafe_h`はデータを危険に変換するのではなく、Strong Parametersが保持していた「許可済みかどうか」という安全境界を捨てるAPIである。必要なキーを明示してから変換する。

## 必須構成

1. `ActionController::Parameters`が持つpermitted状態
2. `permit`、`to_h`、`to_unsafe_h`の違い
3. GET/POSTというHTTPメソッドと信頼性は別問題
4. 検索条件・Ransack・ソート条件で起きる想定外キー
5. Mass Assignmentに流れた場合
6. ネストしたパラメータと配列
7. 許可リスト、専用Query Object、型付き入力へ置き換える
8. ログへ機微情報を出さない

## 必須コード・検証

- 危険な例: `Model.where(params.to_unsafe_h)`
- 安全な例: `params.permit(:q, :status, :page).to_h`
- Query Objectでソート列をallowlistする例
- 不許可キーが無視/拒否されるRequest Spec

## 技術的に必ず守る事実

- Strong Parametersは認可全体を代替しない
- `permit`したから業務上アクセス可能とは限らない

## メリット・デメリットとして扱う点

- `permit`: 境界が明確／許可項目の保守が必要
- Query Object: 型と制約を集約／クラスが増える

## 避ける記述

- `to_unsafe_h`自体を脆弱性と断定しない
- GETは副作用がないから入力検証不要、と書かない

## 記事の結論

入力値の安全性ではなく、「どの時点で信頼境界を解除したか」をコード上で追えることが重要だと締める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 11: RSpecのRequest SpecとController Specは何をテストしているのか

## メタデータ

```yaml
article_id: 11
title: "RSpecのRequest SpecとController Specは何をテストしているのか"
slug: "request-spec-vs-controller-spec"
series: "Rails / Testing"
tags:
  - rails
  - rspec
  - request-spec
  - controller-spec
output_path: "articles/11_request-spec-vs-controller-spec.md"
thumbnail: "/images/articles/request-spec-vs-controller-spec.png"
```

## この記事の出発点

APIの挙動をどのレイヤーで確認すべきか迷い、Request SpecとController Specが同じコントローラを二重にテストしているように見えた。実際には、通過する境界と保証する責務が異なる。

## 中心命題

Request Specはルーティングやミドルウェアを含むHTTP境界からの振る舞いを確認し、Controller Specはコントローラ単体に近い観測を行う。現代的なRails APIではRequest Specを中心にし、必要な局所テストだけを追加する。

## 必須構成

1. Request Specが通る経路：routing、middleware、authentication、controller、serialization
2. Controller Specが省略・差し替えやすい境界
3. HTTPステータス、ヘッダ、JSON、DB状態の確認
4. モデルバリデーションを全ケース再試験する必要はない理由
5. 認証・認可・ルーティングの失敗はRequest Specで見る
6. Controller Specが有効な局所例
7. System Specとの違い
8. 既存Controller Specを移行するときの判断

## 必須コード・検証

- 同じAPIをRequest SpecとController Specで書いた比較例
- Request Specで認証、ルーティング、JSONを確認
- モデル単体テストとの責務分離を示すテスト一覧

## 技術的に必ず守る事実

- RSpec Railsの推奨やAPIは利用バージョンで確認する
- テスト種別名より、実際に通る境界を理解する

## メリット・デメリットとして扱う点

- Request Spec: 信頼性が高い／セットアップと実行コストがやや高い
- Controller Spec: 局所的で速い／実経路との差が生まれやすい

## 避ける記述

- Controller Specは完全に不要と断定しない
- Request Specだけでモデルの全仕様を確認しようとしない

## 記事の結論

重複して見えるテストでも、異なる境界の契約を保証しているなら意味がある、とまとめる。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 12: 単体テストで確認済みの処理をAPIテストでも確認すべきか

## メタデータ

```yaml
article_id: 12
title: "単体テストで確認済みの処理をAPIテストでも確認すべきか"
slug: "test-duplication-across-layers"
series: "Rails / Testing"
tags:
  - testing
  - test-pyramid
  - integration-test
  - rspec
output_path: "articles/12_test-duplication-across-layers.md"
thumbnail: "/images/articles/test-duplication-across-layers.png"
```

## この記事の出発点

Model Specで確認した条件をRequest Specでも書くと、重複して無駄に見える。一方で、API経由で本当にそのルールが適用されるかは単体テストだけでは保証できない。

## 中心命題

同じ条件を複数レイヤーで検証すること自体が問題ではない。実装詳細を同じ形で繰り返すのではなく、各レイヤーの契約に必要な代表ケースを重ねる。

## 必須構成

1. 重複テストと冗長テストの違い
2. テストピラミッドを絶対ルールではなくコストモデルとして説明
3. 単体テストは分岐を細かく、統合テストは代表フローを確認
4. バリデーション失敗が正しいHTTPレスポンスになるか
5. 認証・認可・シリアライズ・トランザクションとの結合
6. 重要業務フローで意図的に重ねるケース
7. 変更に弱いモック中心テストの問題
8. 削除候補を見つける判断チェックリスト

## 必須コード・検証

- 同じ`email required`条件をModel SpecとRequest Specで異なる観点から検証
- 過剰に同じ実装メソッドをmockする悪い例
- 代表ケースだけを統合テストに残す例

## 技術的に必ず守る事実

- テスト数ではなく、失敗時に何を検知できるかで評価する
- 高速な単体テストと実経路テストの双方に価値がある

## メリット・デメリットとして扱う点

- 重複を減らす: 保守量と実行時間を削減／境界の欠陥を見逃す可能性
- 重要経路を重ねる: 回帰検知力／変更時の修正箇所が増える

## 避ける記述

- テストピラミッドの比率を固定値として示さない
- すべてのケースをE2Eへコピーしない

## 記事の結論

「同じ入力を使っているか」ではなく「同じ失敗原因を同じ観測で重ねていないか」で判断する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 13: RSpecのlet_it_beは高速化手段だが、データ汚染を起こしやすい

## メタデータ

```yaml
article_id: 13
title: "RSpecのlet_it_beは高速化手段だが、データ汚染を起こしやすい"
slug: "let-it-be-shared-state-pollution"
series: "Rails / Testing"
tags:
  - rspec
  - test-prof
  - let-it-be
  - test-isolation
output_path: "articles/13_let-it-be-shared-state-pollution.md"
thumbnail: "/images/articles/let-it-be-shared-state-pollution.png"
```

## この記事の出発点

大量のDBセットアップを高速化するため`let_it_be`を使ったが、共有レコードを更新・削除するテストが混ざると、実行順で結果が変わる不安定なSpecになった。

## 中心命題

`let_it_be`はデータ作成回数を減らす代わりに、テスト間分離の責任を呼び出し側へ移す。読み取り専用のfixtureとして使い、変更するデータは各exampleで作る。

## 必須構成

1. `let`、`let!`、`before`、`let_it_be`の生成タイミング
2. TestProfの機能であることを明示
3. 同じDB行・同じRubyオブジェクトの共有範囲
4. 更新、削除、関連追加による汚染
5. 実行順依存と単体実行では再現しない問題
6. `reload`、`refind`、`freeze`/immutableオプション等を利用バージョンで確認
7. 読み取り専用マスタデータに限定するルール
8. 高速化前後の計測

## 必須コード・検証

- 汚染が起きる最小RSpec
- random orderで失敗する例
- 変更対象だけ`let!`へ戻した修正版
- 共有レコードを更新しないことをlint的に守る案

## 技術的に必ず守る事実

- `let_it_be`はRSpec標準ではなくtest-prof由来
- トランザクショナルテスト設定との相互作用を確認する
- RubyオブジェクトをreloadしてもDB行の共有自体は残る

## メリット・デメリットとして扱う点

- 高速化: 大量fixture作成を削減／分離性と理解コストを失う
- exampleごと作成: 安全／遅い

## 避ける記述

- すべてのFactoryを`let_it_be`へ置き換えない
- `reload`だけであらゆる汚染が解消すると書かない

## 記事の結論

テスト高速化は隔離レベルを下げる最適化であり、共有してよい状態を明示する必要がある、と締める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 14: RSpecが巨大化したとき、ファイルを分ける基準

## メタデータ

```yaml
article_id: 14
title: "RSpecが巨大化したとき、ファイルを分ける基準"
slug: "split-large-model-spec"
series: "Rails / Testing"
tags:
  - rspec
  - test-organization
  - model-spec
  - maintainability
output_path: "articles/14_split-large-model-spec.md"
thumbnail: "/images/articles/split-large-model-spec.png"
```

## この記事の出発点

1つのModel Specにvalidation、association、callback、scope、状態遷移、外部連携が積み上がり、検索・実行・レビューが難しくなった。単純に行数で分けても責務が見えない。

## 中心命題

Specは実装メソッド単位ではなく、読者が理解したい振る舞い・変更理由・実行コストのまとまりで分ける。巨大Specはモデル自体の責務過多を示すシグナルでもある。

## 必須構成

1. 巨大化の症状：読み込みが遅い、fixtureが衝突、contextが深い
2. validations、associations、scopes、callbacks、state transitions等の分割候補
3. ファイル名と`describe`の対応
4. 共通fixtureを共有しすぎない
5. 外部API連携をモデルから分離する可能性
6. 1クラス複数Specファイルをテストランナーがどう扱うか
7. CIの並列化と失敗箇所の局所化
8. 分割後も同じ巨大セットアップなら設計を見直す

## 必須コード・検証

- 推奨ディレクトリ例
- `user/validations_spec.rb`等の構成
- shared_contextを乱用した悪い例と、小さなhelperの例

## 技術的に必ず守る事実

- ファイル分割は本体設計の問題を隠す場合がある
- テストの実行順に依存させない

## メリット・デメリットとして扱う点

- 細分化: 探しやすい／ファイル数と重複setupが増える
- 単一ファイル: 全体像／巨大化すると変更影響が読めない

## 避ける記述

- 500行など固定行数を絶対基準にしない
- private methodごとにSpecファイルを作らない

## 記事の結論

良い分割は、テストを速くするだけでなく、ドメインの責務境界を可視化する、とまとめる。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 15: RSpecのStubとMockを用語ではなく目的から理解する

## メタデータ

```yaml
article_id: 15
title: "RSpecのStubとMockを用語ではなく目的から理解する"
slug: "stub-mock-fake-by-purpose"
series: "Rails / Testing"
tags:
  - testing
  - stub
  - mock
  - fake
  - rspec
output_path: "articles/15_stub-mock-fake-by-purpose.md"
thumbnail: "/images/articles/stub-mock-fake-by-purpose.png"
```

## この記事の出発点

Stub、Mock、Fakeの定義を暗記しても、外部APIクライアントやジョブをどれで置き換えるべきか判断できなかった。目的を「値の制御」「相互作用の検証」「動く代替実装」に分けると選びやすくなった。

## 中心命題

テストダブルは用語より、何を保証したいかで選ぶ。Stubは入力に対する返り値を制御し、Mockは重要な相互作用を契約として検証し、Fakeは実際に動く軽量実装として振る舞う。

## 必須構成

1. 用語分類には流派差があることを先に注記
2. RSpecの`allow`、`expect(...).to receive`、spy
3. Stubで外部レスポンスを固定する
4. Mockで重要な通知・保存要求を検証する
5. Fake RepositoryやFake Storageの利点
6. verifying doubleを使う理由
7. `any_instance_of`の問題
8. モックが実装詳細へ密結合する兆候

## 必須コード・検証

- DioではなくRails側のHTTP clientをstubする例
- `instance_double`と`have_received`
- インメモリFake Repository
- Fakeが本番実装と契約不一致になるテスト

## 技術的に必ず守る事実

- Mockの意味はライブラリ/書籍で差がある
- テストダブルは本番契約を自動で保証しない

## メリット・デメリットとして扱う点

- Stub: 簡単／過度に使うと統合不良を見逃す
- Mock: 相互作用を保証／リファクタリング耐性が下がる
- Fake: 現実的／実装と保守が増える

## 避ける記述

- 用語警察のような記事にしない
- すべての依存をMock化しない

## 記事の結論

「何を置き換えたか」より「このテストでどの契約を保証したいか」を先に決める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

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

# Article 19: Railsの関連付けを名前解決とオブジェクト同一性から理解する

## メタデータ

```yaml
article_id: 19
title: "Railsの関連付けを名前解決とオブジェクト同一性から理解する"
slug: "class-name-and-inverse-of"
series: "Rails / Active Record"
tags:
  - rails
  - associations
  - class-name
  - inverse-of
  - identity
output_path: "articles/19_class-name-and-inverse-of.md"
thumbnail: "/images/articles/class-name-and-inverse-of.png"
```

## この記事の出発点

関連名とクラス名が一致しないため`class_name`が必要になり、さらに`inverse_of`の意味が分からなかった。同じDB行を指していてもRuby上で別インスタンスになる問題まで追うと理解できた。

## 中心命題

`class_name`は関連名からクラスを解決する規約を上書きし、`inverse_of`は双方向関連が同じインメモリオブジェクトを参照できるようにする。DB上の同一行とRubyオブジェクトの同一性は別である。

## 必須構成

1. Railsが関連名からクラス名・外部キーを推論する規約
2. `class_name`と`foreign_key`
3. 自動inverse推論が効くケース/効かないケースを利用バージョンで確認
4. 未保存親子オブジェクトとvalidation
5. nested attributes
6. 同じDB行を別インスタンスで読む場合
7. `inverse_of`がN+1を必ず解決するわけではない
8. 循環参照とメモリ

## 必須コード・検証

- `User has_many :authored_posts, class_name: 'Post', foreign_key: ...`
- `Post belongs_to :author, inverse_of: :authored_posts`
- `equal?`と`==`でオブジェクトを比較するコンソール例
- 未保存関連のvalidation RSpec

## 技術的に必ず守る事実

- `class_name`は名前解決、`inverse_of`は逆関連のインメモリ対応
- RailsのIdentity Map全般を提供する機能ではない

## メリット・デメリットとして扱う点

- `inverse_of`: 追加クエリや不整合を減らせる／複雑な関連では推論・設定が難しい

## 避ける記述

- `inverse_of`で常に同じインスタンスになると広く一般化しない
- N+1対策としてのみ説明しない

## 記事の結論

ORMでは「同じ行」「等価な値」「同じRubyオブジェクト」を分けて観測する必要がある、と締める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 20: DartのFutureとasyncとawaitを混同していた

## メタデータ

```yaml
article_id: 20
title: "DartのFutureとasyncとawaitを混同していた"
slug: "dart-future-async-await"
series: "Flutter / Dart"
tags:
  - dart
  - flutter
  - future
  - async
  - await
output_path: "articles/20_dart-future-async-await.md"
thumbnail: "/images/articles/dart-future-async-await.png"
```

## この記事の出発点

interfaceに`Future<String?> readRefreshToken();`と書かれているのに`await`がなく、なぜ非同期なのか分からなかった。戻り値の型、実装側の修飾子、呼び出し側の待機構文を同じものとして捉えていた。

## 中心命題

`Future<T>`は将来得られる値を表す型、`async`は関数本体を非同期に書くための修飾子、`await`はFutureの完了まで現在のasync関数を一時停止する式である。宣言・実装・呼び出しを分けて理解する。

## 必須構成

1. interface/abstract methodは実装を持たないため`async`不要
2. `Future<T>`を返す同期的な関数宣言
3. `async`関数が返り値をFutureで包むこと
4. 呼び出し側の`await`
5. Futureをそのままreturnする場合
6. `return await`が必要になるtry/catch等の文脈
7. エラーがFutureとして伝播する仕組み
8. 並列実行と直列awaitの違い

## 必須コード・検証

- `Future<String?> read()`のinterfaceと実装
- `return storage.read(...)`と`return await storage.read(...)`比較
- `Future.wait`で並列化する例
- エラー伝播のunit test

## 技術的に必ず守る事実

- `await`はスレッドをブロックする説明にしない
- `async`を付けるだけで別スレッド実行になるわけではない
- イベントループ/Isolateの詳細へ必要以上に広げない

## メリット・デメリットとして扱う点

- Futureを直接返す: 簡潔・スタックが明確／局所try-catchしにくい
- `async/await`: 読みやすい／不要なasyncは層を増やす

## 避ける記述

- 非同期=並列と書かない
- `await`がUIスレッドを物理的に停止すると説明しない

## 記事の結論

型、関数の書き方、待ち方を分離すると、非同期コードの責務が読めるようになる、とまとめる。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 21: Dartのfinalとconstは何を固定しているのか

## メタデータ

```yaml
article_id: 21
title: "Dartのfinalとconstは何を固定しているのか"
slug: "dart-final-vs-const"
series: "Flutter / Dart"
tags:
  - dart
  - flutter
  - final
  - const
  - immutability
output_path: "articles/21_dart-final-vs-const.md"
thumbnail: "/images/articles/dart-final-vs-const.png"
```

## この記事の出発点

`final`も`const`も再代入できないため同じに見えたが、実行時に一度だけ決まる値と、コンパイル時に確定する定数では役割が異なる。さらに`final List`の中身は変更できるため、「変数が固定」と「オブジェクトが不変」も分ける必要があった。

## 中心命題

`final`は変数への再代入を禁止し、値は実行時に決まってよい。`const`はコンパイル時定数を要求し、constオブジェクト/コレクションは不変で、同値定数のcanonicalizationも起こり得る。

## 必須構成

1. `final`の一度だけ代入
2. `late final`の初期化と二重代入エラー
3. `const`式とconst constructor
4. `final List`と`const List`
5. 参照の固定とオブジェクトの不変性
6. Flutterでconst Widgetを使う意味
7. canonicalizationと`identical`の例
8. 無理にconst化しない判断

## 必須コード・検証

- `final now = DateTime.now()`とconst不可の例
- `final list = <int>[]; list.add(1)`
- `const list = <int>[]`の変更失敗
- const constructorを持つ小さなValue Object

## 技術的に必ず守る事実

- const Widgetが常に大幅な性能改善を保証すると断定しない
- constの可否は式全体がコンパイル時定数かで決まる

## メリット・デメリットとして扱う点

- `final`: 柔軟／深い不変性は保証しない
- `const`: 安全・共有可能／実行時値を使えない

## 避ける記述

- final=immutableと説明しない
- constを付ければあらゆる再ビルドがなくなると書かない

## 記事の結論

何を固定したいのかを、変数・参照・オブジェクト・生成時刻の4層で考える。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 22: DI・Dio・SecureStorageを一度に見て混乱したので役割を分解する

## メタデータ

```yaml
article_id: 22
title: "DI・Dio・SecureStorageを一度に見て混乱したので役割を分解する"
slug: "di-dio-secure-storage-roles"
series: "Flutter / Architecture"
tags:
  - flutter
  - dart
  - dependency-injection
  - dio
  - secure-storage
output_path: "articles/22_di-dio-secure-storage-roles.md"
thumbnail: "/images/articles/di-dio-secure-storage-roles.png"
```

## この記事の出発点

認証実装でDI、Dio、FlutterSecureStorageが同じファイルに登場し、すべて「依存関係の仕組み」のように見えた。実際には、設計原則、HTTPライブラリ、永続ストレージ実装という別レイヤーだった。

## 中心命題

DIは依存オブジェクトの生成と受け渡しを外へ出す設計手法、DioはHTTPクライアント、Secure StorageはOSの保護領域へ値を保存する実装である。抽象インターフェースと具象を分けると役割が見える。

## 必須構成

1. DIが解決する問題：生成責務、差し替え、テスト
2. Dioの責務：HTTP、interceptor、timeout、cancel
3. Secure Storageの責務：永続化とOS保護機構への委譲
4. `TokenStorage` interfaceと`SecureTokenStorage`
5. constructor injection
6. Provider/RiverpodをDIコンテナと呼ぶときの範囲
7. 具象ライブラリをdomain層へ漏らさない

## 必須コード・検証

- `abstract interface class TokenStorage`
- `SecureTokenStorage(this._storage)`
- RepositoryへDio/TokenStorageを注入する例
- Fake実装を注入するunit test

## 技術的に必ず守る事実

- Secure Storageは端末が完全に安全であることを保証しない
- DIは特定パッケージ名ではない

## メリット・デメリットとして扱う点

- 抽象化: テスト容易性／interfaceと配線が増える
- 具象直結: 小規模では単純／変更とテストが難しい

## 避ける記述

- DI=Dioと混同する説明を残さない
- すべてのクラスにinterfaceを作ることを推奨しない

## 記事の結論

ライブラリ名を見る前に、「これは設計・通信・保存のどの責務か」を分類する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 23: Access Tokenはメモリ、Refresh TokenはSecure Storageに保存する理由

## メタデータ

```yaml
article_id: 23
title: "Access Tokenはメモリ、Refresh TokenはSecure Storageに保存する理由"
slug: "access-token-memory-refresh-token-secure-storage"
series: "Flutter / Authentication"
tags:
  - flutter
  - authentication
  - access-token
  - refresh-token
  - secure-storage
output_path: "articles/23_access-token-memory-refresh-token-secure-storage.md"
thumbnail: "/images/articles/access-token-memory-refresh-token-secure-storage.png"
```

## この記事の出発点

Access TokenとRefresh Tokenを同じストレージへ保存する実装が単純に見えたが、寿命、権限、再起動後の必要性、漏洩時の影響が異なる。メモリ保持とSecure Storageの分離を検討した。

## 中心命題

一般的には短命なAccess Tokenをメモリ、長命で再発行能力を持つRefresh TokenをSecure Storageへ置くと、永続化する秘密を減らせる。ただし絶対解ではなく、脅威モデル、UX、認証基盤の仕様で判断する。

## 必須構成

1. Access TokenとRefresh Tokenの権限・寿命
2. アプリ再起動時にAccess Tokenをrefreshで再取得する流れ
3. ログアウト時の削除範囲
4. `deleteAll()`ではなく専用キー削除を検討
5. refresh token rotation
6. 端末紛失・root/jailbreak・ログ漏洩
7. 複数アカウントとキー名前空間
8. Secure Storage失敗時の扱い

## 必須コード・検証

- `AuthTokenHolder`のメモリ実装
- `TokenStorage`のrefresh token専用API
- 起動時bootstrapとlogoutの例
- Access Tokenが永続化されていないことを確認するtest

## 技術的に必ず守る事実

- OAuth/OIDCサーバーの仕様を確認する
- Secure Storageは暗号化やOS保護を利用するが、侵害端末での完全防御ではない
- Access Tokenをメモリだけに置けない要件もある

## メリット・デメリットとして扱う点

- メモリ保持: 永続漏洩面を減らす／再起動時refreshが必要
- 永続化: UXが単純／保存秘密と攻撃面が増える

## 避ける記述

- この保存戦略が全アプリの唯一解と断定しない
- Refresh Tokenをログへ出さない

## 記事の結論

トークンの保存場所は「秘密だから全部Secure Storage」ではなく、寿命と再発行能力に応じて最小化する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 24: Flutterで複数の401が同時に返ったとき、Token Refreshを一度だけ実行する設計

## メタデータ

```yaml
article_id: 24
title: "Flutterで複数の401が同時に返ったとき、Token Refreshを一度だけ実行する設計"
slug: "single-flight-token-refresh-concurrent-401"
series: "Flutter / Authentication"
tags:
  - flutter
  - dio
  - authentication
  - concurrency
  - token-refresh
output_path: "articles/24_single-flight-token-refresh-concurrent-401.md"
thumbnail: "/images/articles/single-flight-token-refresh-concurrent-401.png"
```

## この記事の出発点

画面表示時に複数APIを並行実行すると、期限切れAccess Tokenに対して複数の401が同時に返る。それぞれがRefresh APIを呼ぶと、token rotationや再試行が競合する。

## 中心命題

Refresh処理をsingle-flight化し、同時401のうち1つだけが更新を担当し、他は同じFutureを待つ。generation/versionを記録し、既に別リクエストが更新済みなら再refreshせず再試行する。

## 必須構成

1. Thundering Herdとしての同時401
2. 共有中のrefresh Future/Mutex/queue
3. リクエスト送信時のtoken generation
4. 401時に現在generationと比較
5. Refresh endpoint自体をinterceptor対象から除外
6. 元リクエストは最大1回だけretry
7. Refresh失敗時の認証状態リセット
8. キャンセル・タイムアウトとの関係
9. ログにtokenを出さず相関IDを使う

## 必須コード・検証

- `TokenRefreshCoordinator`
- `Future<String>? _inFlightRefresh`方式
- generation counter方式
- Dio interceptorの擬似コード
- 10件同時401でrefresh呼び出しが1回のtest

## 技術的に必ず守る事実

- 並行制御は同一Isolate内だけか、プロセスを跨ぐかを明記
- Refresh Token rotation仕様を認証サーバーに合わせる
- 401すべてが期限切れとは限らない

## メリット・デメリットとして扱う点

- 単一Future共有: 単純／失敗・キャンセル伝播を設計
- queue: 順序制御／待機リクエスト管理が複雑

## 避ける記述

- 401なら無条件refreshし続ける実装を出さない
- 無限retryを許さない

## 記事の結論

認証更新はInterceptorの小技ではなく、並行状態機械として設計する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

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

# Article 27: GETとPUTを文字列で分岐せず、Dartのsealed classで表現する

## メタデータ

```yaml
article_id: 27
title: "GETとPUTを文字列で分岐せず、Dartのsealed classで表現する"
slug: "dart-sealed-class-exhaustive-switch-api"
series: "Flutter / Dart"
tags:
  - dart
  - sealed-class
  - pattern-matching
  - api-design
output_path: "articles/27_dart-sealed-class-exhaustive-switch-api.md"
thumbnail: "/images/articles/dart-sealed-class-exhaustive-switch-api.png"
```

## この記事の出発点

Presigned URLへのGET/PUT処理を文字列やbooleanで切り替えると、必要データの違いと不正組み合わせを表現しやすい。

## 中心命題

各操作を異なるsubtypeとして表現し、sealed基底型に対する網羅的switchでdispatchする。不正状態を実行時チェックではなく型で表現不能にする。

## 必須構成

1. 文字列method分岐の問題
2. enumで足りる場合と、各caseが別データを持つ場合
3. `sealed class S3Request<T>`
4. `GetRequest`と`PutRequest`
5. pattern matchingとexhaustiveness
6. private subtype/constructor
7. generic戻り値設計
8. ケース追加時にコンパイルエラーで気づく利点

## 必須コード・検証

- Dart 3に合わせたsealed classコード
- `switch (request)`でGET/PUTを処理
- 不正method文字列が存在しないことを示すtest

## 技術的に必ず守る事実

- Dart/Flutterの実際の言語バージョンを確認
- sealedは同一library内のsubtyping制約を含むため正確に説明

## メリット・デメリットとして扱う点

- sealed union: 型安全／型数が増える
- enum+data: 単純／case固有データの不整合を許しやすい

## 避ける記述

- 文字列分岐をすべてsealedへ置き換えるとしない
- 存在しない構文を生成しない

## 記事の結論

分岐条件をデータとして持つより、許される操作を型として定義する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 28: IDの有無でPOSTとPUTを切り替えるsaveメソッドは良い設計か

## メタデータ

```yaml
article_id: 28
title: "IDの有無でPOSTとPUTを切り替えるsaveメソッドは良い設計か"
slug: "repository-save-create-update-design"
series: "Flutter / Architecture"
tags:
  - flutter
  - repository
  - api-design
  - create
  - update
output_path: "articles/28_repository-save-create-update-design.md"
thumbnail: "/images/articles/repository-save-create-update-design.png"
```

## この記事の出発点

Repositoryに`save(entity)`を作り、IDがなければPOST、あればPUTとする案は呼び出し側が簡潔になる。一方でcreateとupdateの入力・権限・エラーが違うと、1メソッドが複数責務を隠す。

## 中心命題

create/updateの契約が同じなら`save`は有効だが、APIやドメインの意味が異なるなら明示メソッドまたはCommand型に分ける。IDの有無だけを業務状態の唯一の判定にしない。

## 必須構成

1. `create`と`update`のREST上の違い
2. 新規入力と既存Entityを同じ型にする問題
3. IDがnullableなモデル
4. Repositoryの責務
5. `save`が許容できる条件
6. 明示的`create`/`update`
7. `CreateUserCommand`/`UpdateUserCommand`
8. 戻り値とエラー型
9. 楽観的更新・version

## 必須コード・検証

- `save`分岐実装
- 明示2メソッド実装
- sealed commandでdispatchする代案
- ID有無とAPI呼び分けtest

## 技術的に必ず守る事実

- PUT/PATCHの仕様は実API契約に合わせる
- IDがある=更新可能とは限らず認可が必要

## メリット・デメリットとして扱う点

- `save`: 呼び出し簡潔／副作用と分岐が隠れる
- 分離: 契約が明確／呼び出しAPIが増える

## 避ける記述

- 常に分離が正しいと断定しない
- HTTPメソッドだけでドメイン責務を決めない

## 記事の結論

便利な統合メソッドは、異なる契約を隠していない場合にだけ使う。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 29: Flutterの画面を閉じてもHTTP通信は止まらない――DioのCancelToken

## メタデータ

```yaml
article_id: 29
title: "Flutterの画面を閉じてもHTTP通信は止まらない――DioのCancelToken"
slug: "dio-cancel-token-lifecycle"
series: "Flutter / Networking"
tags:
  - flutter
  - dio
  - cancel-token
  - lifecycle
  - networking
output_path: "articles/29_dio-cancel-token-lifecycle.md"
thumbnail: "/images/articles/dio-cancel-token-lifecycle.png"
```

## この記事の出発点

画面遷移やdispose後もFutureは完了し、不要なレスポンス処理やエラー表示が走る。Widgetが消えたこととHTTP要求のキャンセルは自動連動しない。

## 中心命題

CancelTokenをリクエスト所有者のライフサイクルへ結び付け、dispose時にクライアント側の待機・通信を中止する。ただしサーバーで開始済みの処理まで必ず止まるわけではない。

## 必須構成

1. Futureには一般的な自動キャンセルがない
2. DioのCancelTokenをrequestへ渡す
3. 画面/Provider/Notifierのdisposeでcancel
4. キャンセル例外を通常エラーと区別
5. 複数リクエストに同じtokenを使う範囲
6. 二重送信防止とボタン状態
7. サーバー処理が継続する可能性
8. 冪等APIとの組み合わせ

## 必須コード・検証

- StatefulWidgetのdispose例
- Riverpod `ref.onDispose`例
- `DioExceptionType.cancel`等は利用バージョン確認
- キャンセル時にerror reporterへ送らないtest

## 技術的に必ず守る事実

- TCP/HTTPキャンセルとサーバーside effect停止は別
- Dio API名はバージョンに合わせる

## メリット・デメリットとして扱う点

- 積極キャンセル: リソース節約／所有関係の管理が必要
- 結果無視: 実装簡単／通信は継続

## 避ける記述

- `mounted`チェックだけで通信が止まると書かない
- CancelTokenでサーバートランザクションもrollbackすると書かない

## 記事の結論

非同期処理は「誰が開始したか」だけでなく「誰が終了責任を持つか」を設計する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 30: GoRouterのrefreshListenableとRiverpodを接続するAdapter設計

## メタデータ

```yaml
article_id: 30
title: "GoRouterのrefreshListenableとRiverpodを接続するAdapter設計"
slug: "gorouter-riverpod-refresh-adapter"
series: "Flutter / Routing"
tags:
  - flutter
  - gorouter
  - riverpod
  - adapter
  - routing
output_path: "articles/30_gorouter-riverpod-refresh-adapter.md"
thumbnail: "/images/articles/gorouter-riverpod-refresh-adapter.png"
```

## この記事の出発点

GoRouterはルーティング再評価の通知をListenableとして受け取り、RiverpodはProviderの状態として認証を管理する。異なるリアクティブモデルを直接結ぶと、再生成や無限redirectが起きやすい。

## 中心命題

GoRouterとRiverpodの間に小さなAdapterを置き、認証状態変更を`notifyListeners`へ変換する。Routerの寿命、Provider購読解除、redirectの純粋性を明示する。

## 必須構成

1. GoRouterが再評価を必要とするタイミング
2. Riverpodのauth state
3. `ChangeNotifier`/Listenable adapter
4. Adapterの購読開始とdispose
5. RouterをProvider内で一度生成する
6. redirectで状態を変更しない
7. 未初期化/loading/authenticated/unauthenticated
8. 無限redirectと同一location
9. deep link保持

## 必須コード・検証

- 現行GoRouter/Riverpod版に合わせたAdapter
- `ref.listen`から`notifyListeners`
- redirect matrix
- auth state変更で期待locationへ遷移するtest

## 技術的に必ず守る事実

- `refreshListenable`等のAPIはpackage版を確認
- BuildContext依存とProvider依存の循環を避ける

## メリット・デメリットとして扱う点

- Adapter: 境界が明確／寿命管理が増える
- Router再生成: 単純に見える／履歴や状態を失う危険

## 避ける記述

- redirect内でlogin処理を実行しない
- 毎buildでGoRouterを新規生成しない

## 記事の結論

異なる状態管理モデルを接続するときは、暗黙変換ではなく寿命を持つAdapterとして境界化する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 31: Flutterのタブ切り替えで画面状態を保持するStatefulShellRoute

## メタデータ

```yaml
article_id: 31
title: "Flutterのタブ切り替えで画面状態を保持するStatefulShellRoute"
slug: "stateful-shell-route-tab-state"
series: "Flutter / Routing"
tags:
  - flutter
  - gorouter
  - stateful-shell-route
  - navigation
  - tabs
output_path: "articles/31_stateful-shell-route-tab-state.md"
thumbnail: "/images/articles/stateful-shell-route-tab-state.png"
```

## この記事の出発点

BottomNavigationBarでタブを切り替えるたびに画面履歴やスクロール位置が消える問題があり、単一NavigatorとbranchごとのNavigatorの違いを理解する必要があった。

## 中心命題

`StatefulShellRoute`はbranchごとに独立したNavigator stackを持たせ、タブ切り替え後も各branchの履歴と状態を保持する。保持できる代わりに、戻る操作、deep link、メモリ使用量を設計する必要がある。

## 必須構成

1. `ShellRoute`と`StatefulShellRoute`の違いを利用版に合わせて説明
2. branchごとのNavigatorKey
3. BottomNavigationBarと`navigationShell.goBranch`
4. 初期locationへ戻す動作
5. Android back/ブラウザback
6. deep linkで特定branch内部へ入る
7. タブ再選択時のscroll-to-top等
8. 複数Navigatorが保持するWidget/状態とメモリ

## 必須コード・検証

- 3branchの最小GoRouter設定
- 各タブでdetailへ進み、切替後に履歴が残るWidget test
- backボタンの期待をテーブル化

## 技術的に必ず守る事実

- GoRouter APIは利用中バージョンを確認する
- Widget state保持とサーバーデータcache保持は別

## メリット・デメリットとして扱う点

- 独立Navigator: UXが自然／ルート構成とback制御が複雑
- 単一Navigator: 単純／タブ履歴を失いやすい

## 避ける記述

- StatefulShellRouteを使えば全状態が永続化されると書かない
- GlobalKeyを無秩序に共有しない

## 記事の結論

タブUIは見た目の切り替えではなく、複数のナビゲーション履歴をどう所有するかの設計だと締める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 32: providers.dartとproviders.g.dartはどうつながっているのか

## メタデータ

```yaml
article_id: 32
title: "providers.dartとproviders.g.dartはどうつながっているのか"
slug: "riverpod-generated-provider-code"
series: "Flutter / Riverpod"
tags:
  - flutter
  - riverpod
  - code-generation
  - build-runner
output_path: "articles/32_riverpod-generated-provider-code.md"
thumbnail: "/images/articles/riverpod-generated-provider-code.png"
```

## この記事の出発点

`@riverpod`を書いたファイルと、自動生成された`.g.dart`の関係が分からず、どちらが実行されるコードなのか混乱した。

## 中心命題

手書き関数/Notifierがproviderの定義元で、generatorは型安全なProviderオブジェクト、hash、ref型などの接着コードを生成する。生成物は直接編集せず、annotationとbuild設定を管理する。

## 必須構成

1. `part 'providers.g.dart';`
2. `@riverpod`が対象を示す
3. 生成されるProviderオブジェクト
4. 関数名とprovider名の対応
5. autoDisposeとkeepAlive
6. family引数
7. `build_runner`の実行とwatch
8. 生成差分をcommitする方針
9. testでoverrideする方法

## 必須コード・検証

- 関数providerとclass Notifierの2例
- 生成前後の概念図
- `ProviderScope(overrides: ...)` test
- 生成ファイルを編集して再生成で消える例は説明のみ

## 技術的に必ず守る事実

- Riverpod generator APIはメジャーバージョンで変わるためpubspecを確認
- 生成物の全行を解説せず責務に集中する

## メリット・デメリットとして扱う点

- codegen: 型安全・boilerplate削減／build時間・生成規約への依存
- 手書きProvider: 明示的／定型コード

## 避ける記述

- 生成コードを魔法とだけ表現しない
- 古いannotation/Ref型を現行版へ混ぜない

## 記事の結論

コード生成はロジックを生成するというより、宣言とランタイムAPIの接着層を自動化していると理解する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 33: Flutterの未捕捉エラーを一か所へ集約する

## メタデータ

```yaml
article_id: 33
title: "Flutterの未捕捉エラーを一か所へ集約する"
slug: "flutter-global-error-handling"
series: "Flutter / Reliability"
tags:
  - flutter
  - error-handling
  - fluttererror
  - runzonedguarded
  - observability
output_path: "articles/33_flutter-global-error-handling.md"
thumbnail: "/images/articles/flutter-global-error-handling.png"
```

## この記事の出発点

Flutter Framework内のエラー、非同期処理の未捕捉エラー、PlatformDispatcher経由のエラーが別経路で届き、同じ例外が二重送信されることもあった。

## 中心命題

エラー発生源ごとの入口を理解したうえで、共通`ErrorReporter`へ正規化する。表示用フォールバック、ログ送信、デバッグ時の再throw、重複排除を分離する。

## 必須構成

1. `FlutterError.onError`
2. `PlatformDispatcher.instance.onError`
3. `runZonedGuarded`
4. `ErrorWidget.builder`の役割
5. 同期/非同期/framework/platformの違い
6. 元のhandlerを保持するか
7. debug/profile/releaseでの方針
8. exception identity・fingerprint・event IDによる重複抑止
9. 機微情報のscrub

## 必須コード・検証

- `ErrorReporter.capture(error, stack, source)`
- `main()`の初期化例
- 同一例外が複数経路で来ても1回送信するtest
- ErrorWidgetは報告とUIを分ける

## 技術的に必ず守る事実

- Flutter SDKバージョンでエラー経路を確認
- すべての例外が完全に捕捉できると断定しない
- Zoneを過度にアプリ設計へ浸透させない

## メリット・デメリットとして扱う点

- 集中化: 観測性・一貫性／入口ごとの差異を隠しすぎる危険
- 個別処理: 文脈豊富／漏れと重複

## 避ける記述

- catchして握りつぶす例を推奨しない
- ErrorWidgetで回復したから処理状態も正常と扱わない

## 記事の結論

エラーハンドリングは「全部catchする」ことではなく、発生源・報告・回復・表示を別責務として接続することだと締める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

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

# Article 35: Swiftのnonisolatedをactor isolationから理解する

## メタデータ

```yaml
article_id: 35
title: "Swiftのnonisolatedをactor isolationから理解する"
slug: "swift-nonisolated-actor-isolation"
series: "Swift / Concurrency"
tags:
  - swift
  - concurrency
  - actor
  - nonisolated
  - swift-6
output_path: "articles/35_swift-nonisolated-actor-isolation.md"
thumbnail: "/images/articles/swift-nonisolated-actor-isolation.png"
```

## この記事の出発点

`unisolated`と記憶していたが正しくは`nonisolated`だった。綴りだけでなく、actor内なのになぜawait不要で呼べるのかを理解する必要があった。

## 中心命題

actorの宣言内にあるメンバーは原則としてactor-isolatedだが、`nonisolated`メンバーはactorの保護状態へ触れない契約で隔離外から同期的に呼べる。

## 必須構成

1. data raceとactor isolation
2. actor-isolated property/method
3. actor外から`await`が必要な理由
4. `nonisolated` method/property
5. isolated stateへアクセスできないコンパイルエラー
6. protocol requirementを満たすケース
7. `@MainActor`との関係
8. Swift言語モード/Strict Concurrencyの差

## 必須コード・検証

- `actor UserStore`の通常methodとnonisolated method
- nonisolatedからmutable stateへ触れて失敗する例
- Sendable/immutable値に触れる場合は利用版のルールに合わせる
- XCTestでactor stateを検証

## 技術的に必ず守る事実

- Swift 6モード等の設定をPackage.swift/Xcodeで確認
- `nonisolated(unsafe)`を通常解として推奨しない

## メリット・デメリットとして扱う点

- nonisolated: protocol適合・同期利用／actor stateを利用できない
- isolated: 安全な状態アクセス／await境界

## 避ける記述

- `nonisolated`でスレッドセーフになると書かない
- actorがすべての並行問題を解決するとしない

## 記事の結論

隔離を外すのは高速化テクニックではなく、「このメンバーは保護状態に依存しない」というAPI契約である。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 36: SwiftUIのignoresSafeAreaを画面座標とSafe Areaから理解する

## メタデータ

```yaml
article_id: 36
title: "SwiftUIのignoresSafeAreaを画面座標とSafe Areaから理解する"
slug: "swiftui-ignores-safe-area"
series: "SwiftUI"
tags:
  - swiftui
  - safe-area
  - ignores-safe-area
  - layout
output_path: "articles/36_swiftui-ignores-safe-area.md"
thumbnail: "/images/articles/swiftui-ignores-safe-area.png"
```

## この記事の出発点

`ignore change area`のように曖昧に覚えていたが、正しくは`ignoresSafeArea`だった。背景を端まで伸ばしたいだけなのに、コンテンツまでノッチやホームインジケータへ重なることがあった。

## 中心命題

Safe AreaはシステムUIとの安全な表示領域で、`ignoresSafeArea`は指定region/edgeについてレイアウトをその外へ拡張する。通常は背景へ適用し、操作要素はSafe Area内に残す。

## 必須構成

1. Safe Areaの上端/下端/横端
2. notch、Dynamic Island、home indicator
3. `ignoresSafeArea()`の基本
4. 背景Viewだけへmodifierを付ける
5. edges/regionsとkeyboard safe area
6. NavigationStack/TabView/Sheet内の挙動
7. GeometryReaderでの誤用
8. 旧`edgesIgnoringSafeArea`との関係を対象OS版で確認

## 必須コード・検証

- ZStackの背景だけを全画面化
- ボタンをSafe Area内に残す例
- keyboard regionの例
- Previewで複数deviceを確認

## 技術的に必ず守る事実

- 端末形状・OS版でSafe Areaが異なる
- modifierの適用先がレイアウト結果を変える

## メリット・デメリットとして扱う点

- 全画面背景: 見栄え／可読性・操作性を損なう可能性
- Safe Area遵守: 安全／意図する没入表現に不足

## 避ける記述

- ルートView全体へ無条件適用しない
- Safe Areaを固定pixel insetとして説明しない

## 記事の結論

Safe Areaを消すのではなく、「どの描画だけを安全境界の外へ出すか」を選ぶmodifierとして理解する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 37: FlutterエンジニアがSwiftUIを学ぶときに混同しやすい概念

## メタデータ

```yaml
article_id: 37
title: "FlutterエンジニアがSwiftUIを学ぶときに混同しやすい概念"
slug: "flutter-engineer-learning-swiftui"
series: "Flutter → SwiftUI"
tags:
  - flutter
  - swiftui
  - comparison
  - state-management
  - navigation
output_path: "articles/37_flutter-engineer-learning-swiftui.md"
thumbnail: "/images/articles/flutter-engineer-learning-swiftui.png"
```

## この記事の出発点

FlutterのWidget/build/Provider/Navigatorの知識をそのままSwiftUIへ当てはめると、Viewの値型、property wrapper、identity、lifecycleで誤解が生まれた。

## 中心命題

似たAPI名の一対一対応表ではなく、状態の所有、View identity、再計算、navigation、非同期taskの実行モデルを比較する。

## 必須構成

1. WidgetとSwiftUI Viewの共通点/差
2. `build`と`body`
3. StatefulWidget/Stateと`@State`
4. Riverpodと`@State`/`@StateObject`/`@Observable`/Environment
5. Navigator/GoRouterとNavigationStack
6. const Widgetと値型View
7. disposeとSwiftUI lifecycleの非対称
8. async/awaitは似るがUI isolationが違う
9. List identity/keyとForEach id

## 必須コード・検証

- 同じカウンタ画面をFlutter/SwiftUIで並べる
- API取得と画面離脱のtask cancellation比較
- navigation最小例

## 技術的に必ず守る事実

- SwiftUI observation APIは対象OS/Swift版を確認
- 一対一対応できない箇所を明示

## メリット・デメリットとして扱う点

- 既存知識の類推: 学習高速化／誤った対応関係
- 実行モデルから学ぶ: 正確／初期コスト

## 避ける記述

- FlutterとSwiftUIの優劣記事にしない
- 名称だけの対応表で終わらせない

## 記事の結論

他フレームワーク経験は語彙の近道にはなるが、状態とidentityのモデルを移植してはいけない。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

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

# Article 39: with_lock、save、copyWith――短いメソッド名の裏にある複雑な動作

## メタデータ

```yaml
article_id: 39
title: "with_lock、save、copyWith――短いメソッド名の裏にある複雑な動作"
slug: "framework-api-abstraction-leaks"
series: "Cross-stack"
tags:
  - abstraction
  - frameworks
  - with-lock
  - save
  - copywith
output_path: "articles/39_framework-api-abstraction-leaks.md"
thumbnail: "/images/articles/framework-api-abstraction-leaks.png"
```

## この記事の出発点

`with_lock`は囲むだけ、`save`は保存するだけ、`copyWith`はコピーするだけに見える。しかし実際にはreload、I/O、transaction、instance生成、null semanticsなどの副作用が隠れる。

## 中心命題

便利なAPIは複雑さを削除するのではなく、通常経路から隠す。障害調査では、戻り値、状態変更、I/O、ライフサイクル、例外、並行性の6点で抽象化を開く。

## 必須構成

1. `with_lock`: transaction/row lock/reload
2. Repository `save`: create/update/network
3. `copyWith`: 新instanceとnull semantics
4. `deleteAll`: 保存領域の広すぎる削除
5. `CancelToken`: client側だけのcancel
6. Scope名: Relation/件数
7. 抽象化漏れが起きる兆候
8. 公式実装・生成SQL・ログを読む手順
9. APIレビュー用チェックリスト

## 必須コード・検証

- 各APIを1つずつ最小コードで示す
- 副作用チェックリストのMarkdown表
- wrapper APIで契約を狭める例

## 技術的に必ず守る事実

- 抽象化漏れは必ずしも設計欠陥ではない
- 内部実装依存と公開契約を区別する

## メリット・デメリットとして扱う点

- 高レベルAPI: 生産性／障害時に内部理解が必要
- 低レベル直接操作: 制御／重複と誤用

## 避ける記述

- フレームワークを使わない方がよいという結論にしない
- 内部実装の偶然を公開契約として扱わない

## 記事の結論

API名から動作を推測せず、状態と境界を観測する習慣を持つ。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---

# Article 40: 実務で必要だったのは、構文知識より実行モデルの理解だった

## メタデータ

```yaml
article_id: 40
title: "実務で必要だったのは、構文知識より実行モデルの理解だった"
slug: "execution-model-over-syntax"
series: "Cross-stack"
tags:
  - engineering
  - execution-model
  - state
  - concurrency
  - transactions
output_path: "articles/40_execution-model-over-syntax.md"
thumbnail: "/images/articles/execution-model-over-syntax.png"
```

## この記事の出発点

Rails、Flutter、Swiftで詰まった問題は構文ミスより、状態がどこにあり、いつ消え、誰が所有し、どの境界で確定するかを誤解したものが多かった。

## 中心命題

フレームワークを横断して再利用できる学習軸は、構文ではなく実行モデルである。状態、identity、lifecycle、transaction、async/concurrency、side effectの6軸でコードを読む。

## 必須構成

1. `Future`型と`await`の混同
2. Dirty TrackingとDB履歴の混同
3. `with_lock`とreload
4. Secure StorageとDIの役割混同
5. Equatableと値等価性
6. Safe Area modifier
7. Request SpecとModel Specの重複
8. 6軸チェックリスト
9. 新しいAPIを学ぶ調査手順
10. シリーズ全体へのリンク構造

## 必須コード・検証

- 1つの処理を状態/境界/時系列で分解するMermaid図
- デバッグ時に出すログの例
- API調査テンプレート

## 技術的に必ず守る事実

- 構文知識を軽視する記事にしない
- すべてのフレームワークへ完全に同じモデルを当てはめない

## メリット・デメリットとして扱う点

- 構文先行: 始めやすい／複雑な障害で止まる
- 実行モデル先行: 応用可能／学習初期は抽象的

## 避ける記述

- 精神論で終わらせない
- 具体例なしに「本質を理解する」とだけ書かない

## 記事の結論

新しい技術を学ぶときは「何を書くか」だけでなく「実行時に何が、どこで、いつ起きるか」を説明できることを目標にする。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。
