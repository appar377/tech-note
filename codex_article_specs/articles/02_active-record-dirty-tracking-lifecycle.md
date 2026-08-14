# Article 02: Rails Dirty TrackingをDBの変更履歴だと思っていた――実際にはいつ消えるのか

## メタデータ

```yaml
article_id: 02
title: "Rails Dirty TrackingをDBの変更履歴だと思っていた――実際にはいつ消えるのか"
slug: "active-record-dirty-tracking-lifecycle"
series: "Rails / Active Record"
tags:
  - rails
  - active-record
  - dirty-tracking
  - lifecycle
output_path: "articles/02_active-record-dirty-tracking-lifecycle.md"
thumbnail: "/images/articles/active-record-dirty-tracking-lifecycle.png"
```

## この記事の出発点

DB上で値が変わった事実は残っているのに、`saved_change_to_attribute?`や`previous_changes`が取れなくなる場面に遭遇した。Dirty Trackingを監査ログのような永続的履歴だと誤解していたことが混乱の原因だった。

## 中心命題

Dirty TrackingはDBの履歴ではなく、特定のActive Recordインスタンスが保存前後の差分を扱うためのライフサイクル依存APIである。保存前、保存直後、コミット後、reload後、別インスタンスで見える情報を分けて理解する必要がある。

## 必須構成

1. 同じDB行でもインスタンスが違えば変更情報を共有しないことを示す
2. 保存前：`changes_to_save`、`will_save_change_to_attribute?`
3. 保存後：`saved_changes`、`saved_change_to_attribute?`、`attribute_before_last_save`
4. `previous_changes`の位置づけと利用バージョンでの挙動確認
5. コミット後に何が残るか、外側トランザクションがある場合の注意
6. `reload`、再検索、別プロセスで情報が失われる理由
7. 監査履歴が必要ならPaperTrail相当の仕組みや独自履歴テーブルが必要なこと
8. 用途別のメソッド選択表

## 必須コード・検証

- 状態遷移ごとのRubyコンソール例
- `User.find(user.id)`で取り直した別インスタンスとの比較
- RSpecで保存前・保存後・reload後の値を検証

## 技術的に必ず守る事実

- Dirty TrackingはActive Model/Active Recordの変更検知機構
- 監査ログやDBトリガーの履歴とは役割が異なる
- メソッド名と利用可能なタイミングはRailsバージョン差があるためリポジトリで確認する

## メリット・デメリットとして扱う点

- Dirty Tracking利用: 実装が軽いが、ライフサイクルに強く依存する
- 履歴テーブル利用: 永続性があるが、保存量と設計コストが増える

## 避ける記述

- `changed?`など古い/文脈依存APIを無条件に推奨しない
- すべてのメソッドがafter_commitでも永続すると断定しない

## 記事の結論

「何が変わったか」だけでなく、「誰が、いつまで、その差分を覚えているか」を確認する習慣へ一般化する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
