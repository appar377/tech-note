# Article 35: Swiftのnonisolatedをactor isolationから理解する

## メタデータ

```yaml
article_id: 35
title: "Swiftのnonisolatedをactor isolationから理解する"
slug: "swift-nonisolated-actor-isolation"
series: "Swift / Concurrency"
tags:
  - swift
  - concurrency
  - actor
  - nonisolated
  - swift-6
output_path: "articles/35_swift-nonisolated-actor-isolation.md"
thumbnail: "/images/articles/swift-nonisolated-actor-isolation.png"
```

## この記事の出発点

`unisolated`と記憶していたが正しくは`nonisolated`だった。綴りだけでなく、actor内なのになぜawait不要で呼べるのかを理解する必要があった。

## 中心命題

actorの宣言内にあるメンバーは原則としてactor-isolatedだが、`nonisolated`メンバーはactorの保護状態へ触れない契約で隔離外から同期的に呼べる。

## 必須構成

1. data raceとactor isolation
2. actor-isolated property/method
3. actor外から`await`が必要な理由
4. `nonisolated` method/property
5. isolated stateへアクセスできないコンパイルエラー
6. protocol requirementを満たすケース
7. `@MainActor`との関係
8. Swift言語モード/Strict Concurrencyの差

## 必須コード・検証

- `actor UserStore`の通常methodとnonisolated method
- nonisolatedからmutable stateへ触れて失敗する例
- Sendable/immutable値に触れる場合は利用版のルールに合わせる
- XCTestでactor stateを検証

## 技術的に必ず守る事実

- Swift 6モード等の設定をPackage.swift/Xcodeで確認
- `nonisolated(unsafe)`を通常解として推奨しない

## メリット・デメリットとして扱う点

- nonisolated: protocol適合・同期利用／actor stateを利用できない
- isolated: 安全な状態アクセス／await境界

## 避ける記述

- `nonisolated`でスレッドセーフになると書かない
- actorがすべての並行問題を解決するとしない

## 記事の結論

隔離を外すのは高速化テクニックではなく、「このメンバーは保護状態に依存しない」というAPI契約である。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
