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
