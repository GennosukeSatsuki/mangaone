# MangaOne

<div align="center">

**マンガ・同人誌アーカイブ用画像一括リサイザー**

タブレットやスマホで読むために、マンガコレクションを圧縮しましょう。
DLSiteとかで買った同人誌、スマホで見たりするのには画像サイズ大きすぎたりでちょっと微妙ですよね。
そんな時にドラッグ＆ドロップで簡単にサイズダウンして持ち歩きしやすいサイズに圧縮！
そういうアプリです。

[🇺🇸 English README](./README.md) | [最新版をダウンロード](../../releases)

</div>

---

## ✨ 機能

- 📦 **ZIP/CBZ対応** - マンガアーカイブをドラッグ&ドロップ
- 🎯 **スマートリサイズ** - 長辺基準でリサイズ（デフォルト：1200px）
- 🔄 **PNG → JPEG自動変換** - 大幅な容量削減
- 🗜️ **品質調整可能** - 圧縮率を調整（0.1〜1.0）
- 📁 **フォルダ構造維持** - サブフォルダの構成を保持
- 🚀 **高速処理** - マルチスレッド画像処理
- 💻 **クロスプラットフォーム** - Windows、macOS、Linux対応
- 🔒 **完全プライベート** - すべての処理はローカルで実行

## 🎯 こんな人におすすめ

- **タブレットユーザー** - DLSiteやBOOTHの同人誌をiPad/Androidタブレットで快適に
- **スマホで読む人** - ストレージ容量が限られたスマホでも大量のマンガを
- **デジタルコレクター** - 読みやすさを保ちながらコレクションのサイズを削減
- **クラウドストレージ利用者** - 帯域幅とストレージコストを節約

## 📊 圧縮例

実際の圧縮結果：

| 元のフォーマット | 元のサイズ | MangaOne処理後 | 削減率 |
|----------------|-----------|--------------|--------|
| PNGアーカイブ   | 134 MB    | 8 MB         | **94%削減** |
| JPG/PNG混在    | 85 MB     | 12 MB        | **86%削減** |

*品質設定や元画像によって結果は異なります*

## 🚀 使い方

### インストール

**お使いのプラットフォーム向けの最新版をダウンロード：**

- [Windows版 (.exe)](../../releases)
- [macOS版 (.dmg)](../../releases)
- [Linux版 (.AppImage)](../../releases)

### 使用方法

1. **MangaOneを起動**
2. **設定を調整**（任意）
   - 長辺：長辺の目標サイズ（デフォルト：1200px）
   - 品質：JPEG品質 0.1〜1.0（デフォルト：0.8）
3. **ZIP/CBZファイルをドロップ**
4. **処理を待つ** - プログレスバーで進捗確認
5. **ダウンロード** - 最適化されたアーカイブを保存

これだけ！圧縮されたマンガがモバイル読書用に準備完了です。

## 🛠️ 技術詳細

### 技術スタック

- **フロントエンド**: React + TypeScript
- **デスクトップ**: Electron
- **ビルドツール**: Vite
- **画像処理**: browser-image-compression
- **アーカイブ処理**: JSZip
- **UI**: Framer Motion + Lucide Icons

### 内部機能

- BlobをFileに変換して適切な画像圧縮を実現
- macOSシステムファイル（`__MACOSX`、`.DS_Store`）を自動除外
- ネストされたフォルダ構造に対応
- PNG→JPEG変換時にファイル拡張子を更新
- クライアントサイド処理（サーバーアップロード不要）

## 🔧 開発

### 必要なもの

- Node.js 18+
- npm または yarn

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/mangaone.git
cd mangaone

# 依存関係をインストール
npm install

# 開発モードで起動
npm run dev
```

### ビルド

```bash
# 現在のプラットフォーム向けにビルド
npm run build

# 特定のプラットフォーム向けにビルド
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```


ビルドされたパッケージは`release/`ディレクトリに出力されます。

### リリース

このプロジェクトはGitHub Actionsで自動リリースを行います。新しいリリースを作成するには：

```bash
# package.jsonのバージョンを更新
npm version patch  # または minor、major

# タグをプッシュ
git push origin main --tags
```

GitHub Actionsが自動的に：
- Windows、macOS（Intel + Apple Silicon）、Linux向けにビルド
- リリースノートを生成
- すべてのバイナリをGitHub Releasesにアップロード

## 📝 対応フォーマット

### 入力

- `.zip` - 標準ZIPアーカイブ
- `.cbz` - コミックブックZIPフォーマット

### 画像形式

- `.jpg` / `.jpeg`
- `.png`（自動的にJPEGに変換）
- `.gif`
- `.bmp`
- `.webp`
- `.tiff` / `.tif`
- `.svg`

## 🤝 コントリビューション

コントリビューション歓迎！お気軽に：

- バグ報告
- 新機能の提案
- プルリクエストの送信

## 📄 ライセンス

本プロジェクトはMITライセンスの下で公開されています - 詳細は[LICENSE](LICENSE)を参照してください。

## 📚 使用ライブラリ

MangaOneは以下の素晴らしいオープンソースライブラリの上に構築されています：

### コア依存関係

- **[React](https://github.com/facebook/react)** (MIT) - UIフレームワーク
- **[Electron](https://github.com/electron/electron)** (MIT) - デスクトップアプリケーションフレームワーク
- **[TypeScript](https://github.com/microsoft/TypeScript)** (Apache-2.0) - 型安全なJavaScript
- **[Vite](https://github.com/vitejs/vite)** (MIT) - ビルドツール＆開発サーバー

### 画像処理・アーカイブ処理

- **[browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)** (MIT) - クライアントサイド画像圧縮
- **[JSZip](https://github.com/Stuk/jszip)** (MIT/GPL-3.0) - ZIPファイルの作成と操作

### UI・アニメーション

- **[Framer Motion](https://github.com/framer/motion)** (MIT) - アニメーションライブラリ
- **[Lucide React](https://github.com/lucide-icons/lucide)** (ISC) - アイコンセット

### ビルド・開発ツール

- **[electron-builder](https://github.com/electron-userland/electron-builder)** (MIT) - Electronアプリのパッケージング＆ビルド
- **[vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron)** (MIT) - Electron用Viteプラグイン
- **[ESLint](https://github.com/eslint/eslint)** (MIT) - コードリンティング

これらのプロジェクトのメンテナーと貢献者の皆様に感謝します！🙏

## 🙏 謝辞

- マンガと同人誌愛好家のために作成
- オープンソースコミュニティに感謝
- 効率的なモバイルマンガストレージの必要性から着想

---

<div align="center">

**マンガ読者の皆様へ、愛を込めて ❤️**

[⭐ このリポジトリにスター](../../stargazers) | [🐛 バグ報告](../../issues) | [✨ 機能リクエスト](../../issues)

</div>
