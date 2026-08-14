# Article 36: SwiftUIのignoresSafeAreaを画面座標とSafe Areaから理解する

## メタデータ

```yaml
article_id: 36
title: "SwiftUIのignoresSafeAreaを画面座標とSafe Areaから理解する"
slug: "swiftui-ignores-safe-area"
series: "SwiftUI"
tags:
  - swiftui
  - safe-area
  - ignores-safe-area
  - layout
output_path: "articles/36_swiftui-ignores-safe-area.md"
thumbnail: "/images/articles/swiftui-ignores-safe-area.png"
```

## この記事の出発点

`ignore change area`のように曖昧に覚えていたが、正しくは`ignoresSafeArea`だった。背景を端まで伸ばしたいだけなのに、コンテンツまでノッチやホームインジケータへ重なることがあった。

## 中心命題

Safe AreaはシステムUIとの安全な表示領域で、`ignoresSafeArea`は指定region/edgeについてレイアウトをその外へ拡張する。通常は背景へ適用し、操作要素はSafe Area内に残す。

## 必須構成

1. Safe Areaの上端/下端/横端
2. notch、Dynamic Island、home indicator
3. `ignoresSafeArea()`の基本
4. 背景Viewだけへmodifierを付ける
5. edges/regionsとkeyboard safe area
6. NavigationStack/TabView/Sheet内の挙動
7. GeometryReaderでの誤用
8. 旧`edgesIgnoringSafeArea`との関係を対象OS版で確認

## 必須コード・検証

- ZStackの背景だけを全画面化
- ボタンをSafe Area内に残す例
- keyboard regionの例
- Previewで複数deviceを確認

## 技術的に必ず守る事実

- 端末形状・OS版でSafe Areaが異なる
- modifierの適用先がレイアウト結果を変える

## メリット・デメリットとして扱う点

- 全画面背景: 見栄え／可読性・操作性を損なう可能性
- Safe Area遵守: 安全／意図する没入表現に不足

## 避ける記述

- ルートView全体へ無条件適用しない
- Safe Areaを固定pixel insetとして説明しない

## 記事の結論

Safe Areaを消すのではなく、「どの描画だけを安全境界の外へ出すか」を選ぶmodifierとして理解する。

## Codexへの記事固有指示

- 冒頭は一般論から始めず、上記「出発点」の症状または疑問から始める。
- 誤解していた内容を隠さず、どの観測で理解が変わったかを書く。
- コードは対象リポジトリのバージョンと規約へ合わせる。
- 最低1つの失敗再現と、最低1つの再発防止テストを含める。
- 実案件固有名や秘密情報は匿名化する。
- 本仕様にない事実を実体験として捏造しない。


---
