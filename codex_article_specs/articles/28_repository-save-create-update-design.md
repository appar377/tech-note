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
