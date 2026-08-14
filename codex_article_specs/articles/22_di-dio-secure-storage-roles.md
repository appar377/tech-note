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
