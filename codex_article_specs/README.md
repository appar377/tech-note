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

## 9. 記事一覧

01. [Railsのwith_lockでDirty Trackingが消え、after_commitが発火しなくなった理由](articles/01_with-lock-dirty-tracking-after-commit.md) — `Rails / 障害解析`
02. [Rails Dirty TrackingをDBの変更履歴だと思っていた――実際にはいつ消えるのか](articles/02_active-record-dirty-tracking-lifecycle.md) — `Rails / Active Record`
03. [Railsのlock!とwith_lockを、SQLのSELECT FOR UPDATEから理解する](articles/03_rails-pessimistic-locking-select-for-update.md) — `Rails / Database`
04. [Railsのafter_commitは便利だが、業務フローの中心に置くと壊れやすい](articles/04_after-commit-business-workflow.md) — `Rails / Architecture`
05. [S3にはあるがDBにはない、DBにはあるがS3にはない――整合性修復処理の設計](articles/05_s3-db-consistency-reconciliation.md) — `Rails / Storage`
06. [DBトランザクションではS3をロールバックできない――外部ストレージを含む処理の設計](articles/06_db-s3-transaction-boundary.md) — `Rails / Architecture`
07. [Railsで冪等なCSVインポーターを作る――重複防止、更新、論理削除からの復活](articles/07_idempotent-csv-importer-rails.md) — `Rails / Batch`
08. [外部CSVのIDとDBの主キーを混同しない――外部識別子の設計](articles/08_external-id-vs-primary-key.md) — `Rails / Data Modeling`
09. [type_for_attribute(:price).castから理解するActive Recordの型変換](articles/09_active-record-type-casting.md) — `Rails / Active Record`
10. [Railsのquery_parameters.to_unsafe_hを安易に使ってはいけない理由](articles/10_rails-to-unsafe-h-strong-parameters.md) — `Rails / Security`
11. [RSpecのRequest SpecとController Specは何をテストしているのか](articles/11_request-spec-vs-controller-spec.md) — `Rails / Testing`
12. [単体テストで確認済みの処理をAPIテストでも確認すべきか](articles/12_test-duplication-across-layers.md) — `Rails / Testing`
13. [RSpecのlet_it_beは高速化手段だが、データ汚染を起こしやすい](articles/13_let-it-be-shared-state-pollution.md) — `Rails / Testing`
14. [RSpecが巨大化したとき、ファイルを分ける基準](articles/14_split-large-model-spec.md) — `Rails / Testing`
15. [RSpecのStubとMockを用語ではなく目的から理解する](articles/15_stub-mock-fake-by-purpose.md) — `Rails / Testing`
16. [GROUP BYとHAVINGで重複データを検出する](articles/16_sql-group-by-having-duplicates.md) — `Rails / SQL`
17. [RailsエンジニアがSQLを避けられない理由](articles/17_rails-engineer-needs-sql.md) — `Rails / SQL`
18. [highest_price_firstは「最高値1件」なのか「価格降順」なのか](articles/18_active-record-scope-naming.md) — `Rails / Code Review`
19. [Railsの関連付けを名前解決とオブジェクト同一性から理解する](articles/19_class-name-and-inverse-of.md) — `Rails / Active Record`
20. [DartのFutureとasyncとawaitを混同していた](articles/20_dart-future-async-await.md) — `Flutter / Dart`
21. [Dartのfinalとconstは何を固定しているのか](articles/21_dart-final-vs-const.md) — `Flutter / Dart`
22. [DI・Dio・SecureStorageを一度に見て混乱したので役割を分解する](articles/22_di-dio-secure-storage-roles.md) — `Flutter / Architecture`
23. [Access Tokenはメモリ、Refresh TokenはSecure Storageに保存する理由](articles/23_access-token-memory-refresh-token-secure-storage.md) — `Flutter / Authentication`
24. [Flutterで複数の401が同時に返ったとき、Token Refreshを一度だけ実行する設計](articles/24_single-flight-token-refresh-concurrent-401.md) — `Flutter / Authentication`
25. [DartのcopyWithでnullを正しく扱うためのSentinel Pattern](articles/25_dart-copywith-sentinel-pattern.md) — `Flutter / Dart`
26. [Dartの同一性と等価性――identical、==、hashCode、Equatable](articles/26_dart-identity-equality-hashcode-equatable.md) — `Flutter / Dart`
27. [GETとPUTを文字列で分岐せず、Dartのsealed classで表現する](articles/27_dart-sealed-class-exhaustive-switch-api.md) — `Flutter / Dart`
28. [IDの有無でPOSTとPUTを切り替えるsaveメソッドは良い設計か](articles/28_repository-save-create-update-design.md) — `Flutter / Architecture`
29. [Flutterの画面を閉じてもHTTP通信は止まらない――DioのCancelToken](articles/29_dio-cancel-token-lifecycle.md) — `Flutter / Networking`
30. [GoRouterのrefreshListenableとRiverpodを接続するAdapter設計](articles/30_gorouter-riverpod-refresh-adapter.md) — `Flutter / Routing`
31. [Flutterのタブ切り替えで画面状態を保持するStatefulShellRoute](articles/31_stateful-shell-route-tab-state.md) — `Flutter / Routing`
32. [providers.dartとproviders.g.dartはどうつながっているのか](articles/32_riverpod-generated-provider-code.md) — `Flutter / Riverpod`
33. [Flutterの未捕捉エラーを一か所へ集約する](articles/33_flutter-global-error-handling.md) — `Flutter / Reliability`
34. [FlutterのFeature-first構成とDDDを混同していた](articles/34_feature-first-vs-ddd.md) — `Flutter / Architecture`
35. [Swiftのnonisolatedをactor isolationから理解する](articles/35_swift-nonisolated-actor-isolation.md) — `Swift / Concurrency`
36. [SwiftUIのignoresSafeAreaを画面座標とSafe Areaから理解する](articles/36_swiftui-ignores-safe-area.md) — `SwiftUI`
37. [FlutterエンジニアがSwiftUIを学ぶときに混同しやすい概念](articles/37_flutter-engineer-learning-swiftui.md) — `Flutter → SwiftUI`
38. [Rails、Dart、Swiftで異なる同一性と等価性](articles/38_identity-equality-ruby-dart-swift.md) — `Cross-stack`
39. [with_lock、save、copyWith――短いメソッド名の裏にある複雑な動作](articles/39_framework-api-abstraction-leaks.md) — `Cross-stack`
40. [実務で必要だったのは、構文知識より実行モデルの理解だった](articles/40_execution-model-over-syntax.md) — `Cross-stack`
