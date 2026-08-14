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
