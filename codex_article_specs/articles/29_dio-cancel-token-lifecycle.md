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
