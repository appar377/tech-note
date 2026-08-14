# Tech Note Repo Notes

このディレクトリは、2026-07-20作成の40本分記事仕様を保存するためのものです。

## 使い方

- `ALL_ARTICLES_SPEC.md`: 40本分の統合仕様。
- `articles/*.md`: `ALL_ARTICLES_SPEC.md` を1記事ずつ分割した仕様。
- `manifest.json`: 仕様パッケージの一覧。
- `CODEX_PROMPT.md`: Codexに記事生成を依頼するときのマスター依頼文。

## Tech Noteでのパス規約

添付仕様ではサムネイル例が `/images/articles/<slug>.png` になっていますが、このリポジトリでは公開サムネイルを以下で管理します。

```text
public/images/thumbnails/<slug>.png
```

記事FrontMatterでは次の形式を使います。

```yaml
thumbnail: /images/thumbnails/<slug>.png
```

また、仕様内の `output_path` は生成パッケージ上の名前です。Tech Note本体ではカテゴリ別ディレクトリに配置済みの記事を正とします。

## 既存記事の扱い

既に公開済みの記事本文は一括上書きしません。仕様を元にブラッシュアップする場合は、対象記事を1本ずつ選び、既存本文との差分を確認してから更新します。
