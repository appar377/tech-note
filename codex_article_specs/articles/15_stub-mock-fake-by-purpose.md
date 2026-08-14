# Article 15: RSpecのStubとMockを用語ではなく目的から理解する

## メタデータ

```yaml
article_id: 15
title: "RSpecのStubとMockを用語ではなく目的から理解する"
slug: "stub-mock-fake-by-purpose"
series: "Rails / Testing"
tags:
  - testing
  - stub
  - mock
  - fake
  - rspec
output_path: "articles/15_stub-mock-fake-by-purpose.md"
thumbnail: "/images/articles/stub-mock-fake-by-purpose.png"
```

## この記事の出発点

Stub、Mock、Fakeの定義を暗記しても、外部APIクライアントやジョブをどれで置き換えるべきか判断できなかった。目的を「値の制御」「相互作用の検証」「動く代替実装」に分けると選びやすくなった。

## 中心命題

テストダブルは用語より、何を保証したいかで選ぶ。Stubは入力に対する返り値を制御し、Mockは重要な相互作用を契約として検証し、Fakeは実際に動く軽量実装として振る舞う。

## 必須構成

1. 用語分類には流派差があることを先に注記
2. RSpecの`allow`、`expect(...).to receive`、spy
3. Stubで外部レスポンスを固定する
4. Mockで重要な通知・保存要求を検証する
5. Fake RepositoryやFake Storageの利点
6. verifying doubleを使う理由
7. `any_instance_of`の問題
8. モックが実装詳細へ密結合する兆候

## 必須コード・検証

- DioではなくRails側のHTTP clientをstubする例
- `instance_double`と`have_received`
- インメモリFake Repository
- Fakeが本番実装と契約不一致になるテスト

## 技術的に必ず守る事実

- Mockの意味はライブラリ/書籍で差がある
- テストダブルは本番契約を自動で保証しない

## メリット・デメリットとして扱う点

- Stub: 簡単／過度に使うと統合不良を見逃す
- Mock: 相互作用を保証／リファクタリング耐性が下がる
- Fake: 現実的／実装と保守が増える

## 避ける記述

- 用語警察のような記事にしない
- すべての依存をMock化しない

## 記事の結論

「何を置き換えたか」より「このテストでどの契約を保証したいか」を先に決める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
