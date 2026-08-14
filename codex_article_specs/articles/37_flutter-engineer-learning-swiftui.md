# Article 37: FlutterエンジニアがSwiftUIを学ぶときに混同しやすい概念

## メタデータ

```yaml
article_id: 37
title: "FlutterエンジニアがSwiftUIを学ぶときに混同しやすい概念"
slug: "flutter-engineer-learning-swiftui"
series: "Flutter → SwiftUI"
tags:
  - flutter
  - swiftui
  - comparison
  - state-management
  - navigation
output_path: "articles/37_flutter-engineer-learning-swiftui.md"
thumbnail: "/images/articles/flutter-engineer-learning-swiftui.png"
```

## この記事の出発点

FlutterのWidget/build/Provider/Navigatorの知識をそのままSwiftUIへ当てはめると、Viewの値型、property wrapper、identity、lifecycleで誤解が生まれた。

## 中心命題

似たAPI名の一対一対応表ではなく、状態の所有、View identity、再計算、navigation、非同期taskの実行モデルを比較する。

## 必須構成

1. WidgetとSwiftUI Viewの共通点/差
2. `build`と`body`
3. StatefulWidget/Stateと`@State`
4. Riverpodと`@State`/`@StateObject`/`@Observable`/Environment
5. Navigator/GoRouterとNavigationStack
6. const Widgetと値型View
7. disposeとSwiftUI lifecycleの非対称
8. async/awaitは似るがUI isolationが違う
9. List identity/keyとForEach id

## 必須コード・検証

- 同じカウンタ画面をFlutter/SwiftUIで並べる
- API取得と画面離脱のtask cancellation比較
- navigation最小例

## 技術的に必ず守る事実

- SwiftUI observation APIは対象OS/Swift版を確認
- 一対一対応できない箇所を明示

## メリット・デメリットとして扱う点

- 既存知識の類推: 学習高速化／誤った対応関係
- 実行モデルから学ぶ: 正確／初期コスト

## 避ける記述

- FlutterとSwiftUIの優劣記事にしない
- 名称だけの対応表で終わらせない

## 記事の結論

他フレームワーク経験は語彙の近道にはなるが、状態とidentityのモデルを移植してはいけない。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
