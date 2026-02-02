# Euclidean Drum Machine | ユークリディアンドラムマシン

CmajorとReactを使用した、数学的なアルゴリズム（Bjorklundのアルゴリズム）に基づくユークリッド・リズム・ドラムマシンです。

[https://euclidean-drum-machine.serendiproducts.dev/](https://euclidean-drum-machine.serendiproducts.dev/)

## 主な機能

- **ユークリッド・リズム生成**: $E(k, n)$ 形式でパルス（k）とステップ（n）を指定し、幾何学的に均等なリズムを生成。
- **マルチトラックプリセット**: 世界中の伝統的なリズムを一括ロード。
  - Tresillo (3,8), Take Five (2,5), Cinquillo (5,8), Fandango (4,12), Bembe (7,12) など。
- **ドラムキット切り替え**: Standard（クリーン）と Techno（重厚）の2種類を搭載。
- **リアルタイム操作**: テンポ、回転（Rotation）、リバース再生などを動的に変更可能。
- **Web Audio (Cmajor)**: 高精度なオーディオエンジンによる低遅延再生。

## 技術スタック

- **Frontend**: Vite + React + TypeScript
- **Audio Engine**: [Cmajor](https://cmajor.dev/) (JITコンパイルによる高性能オーディオ処理)
- **Styling**: Vanilla CSS (Industrial Neo-Synth Design)

## ディレクトリ構成

- `src/audio/`: Cmajorパッチ (.cmajorpatch, .cmajorファイル)
- `src/components/`: React UIコンポーネント
- `src/constants/`: リズムプリセット定義
- `src/utils/`: Bjorklundアルゴリズムによるリズム生成ロジック
- `public/`: 静的資産 (Favicon, Sitemap, Robots.txt)

## Cmajor の開発とコンパイル

このプロジェクトでは、オーディオエンジンとして Cmajor を使用しています。コードを編集・コンパイルするには、以下の手順が推奨されます：

1. **VSCode 拡張機能のインストール**: VSCode で [Cmajor 拡張機能](https://marketplace.visualstudio.com/items?itemName=SoundStacks.cmajor-vscode) をインストールします。
2. **自動コンパイル**: `.cmajor` や `.cmajorpatch` ファイルを編集して保存すると、拡張機能により自動的にコンパイルが行われ、React 側の再生に反映されます。
3. **スタンドアロン再生**: 必要に応じて `cmajor` コマンドラインツールを使用して、パッチを直接再生・検証することも可能です。

## 開発の始め方

1. **依存関係のインストール**:
   ```bash
   npm install
   ```

2. **開発サーバーの起動**:
   ```bash
   npm run dev
   ```

## ライセンス

このプロジェクト自体は **GPLv3** ライセンスの下で公開されています。
また、オーディオエンジンに [Cmajor](https://cmajor.dev/) を使用しており、その利用規約（GPLv3 または商用ライセンス）に従います。

