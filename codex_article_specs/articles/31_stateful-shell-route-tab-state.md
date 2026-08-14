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
