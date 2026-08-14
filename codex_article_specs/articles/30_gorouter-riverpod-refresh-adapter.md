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
