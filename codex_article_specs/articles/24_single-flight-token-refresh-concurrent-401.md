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
