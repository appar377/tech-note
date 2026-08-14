# Article 13: RSpecのlet_it_beは高速化手段だが、データ汚染を起こしやすい

## メタデータ

```yaml
article_id: 13
title: "RSpecのlet_it_beは高速化手段だが、データ汚染を起こしやすい"
slug: "let-it-be-shared-state-pollution"
series: "Rails / Testing"
tags:
  - rspec
  - test-prof
  - let-it-be
  - test-isolation
output_path: "articles/13_let-it-be-shared-state-pollution.md"
thumbnail: "/images/articles/let-it-be-shared-state-pollution.png"
```

## この記事の出発点

大量のDBセットアップを高速化するため`let_it_be`を使ったが、共有レコードを更新・削除するテストが混ざると、実行順で結果が変わる不安定なSpecになった。

## 中心命題

`let_it_be`はデータ作成回数を減らす代わりに、テスト間分離の責任を呼び出し側へ移す。読み取り専用のfixtureとして使い、変更するデータは各exampleで作る。

## 必須構成

1. `let`、`let!`、`before`、`let_it_be`の生成タイミング
2. TestProfの機能であることを明示
3. 同じDB行・同じRubyオブジェクトの共有範囲
4. 更新、削除、関連追加による汚染
5. 実行順依存と単体実行では再現しない問題
6. `reload`、`refind`、`freeze`/immutableオプション等を利用バージョンで確認
7. 読み取り専用マスタデータに限定するルール
8. 高速化前後の計測

## 必須コード・検証

- 汚染が起きる最小RSpec
- random orderで失敗する例
- 変更対象だけ`let!`へ戻した修正版
- 共有レコードを更新しないことをlint的に守る案

## 技術的に必ず守る事実

- `let_it_be`はRSpec標準ではなくtest-prof由来
- トランザクショナルテスト設定との相互作用を確認する
- RubyオブジェクトをreloadしてもDB行の共有自体は残る

## メリット・デメリットとして扱う点

- 高速化: 大量fixture作成を削減／分離性と理解コストを失う
- exampleごと作成: 安全／遅い

## 避ける記述

- すべてのFactoryを`let_it_be`へ置き換えない
- `reload`だけであらゆる汚染が解消すると書かない

## 記事の結論

テスト高速化は隔離レベルを下げる最適化であり、共有してよい状態を明示する必要がある、と締める。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
