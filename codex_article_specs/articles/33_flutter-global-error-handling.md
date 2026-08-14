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
