# クイックデプロイガイド（15分で本番公開）

## 前提条件
- GitHubアカウント（無料）
- インターネット接続

---

## ステップ1: GitHubリポジトリの作成（5分）

### 1.1 GitHubアカウントの作成（まだない場合）
1. https://github.com にアクセス
2. 「Sign up」をクリック
3. メールアドレス、パスワードを設定
4. メール認証を完了

### 1.2 新しいリポジトリを作成
1. GitHubにログイン
2. 右上の「+」→「New repository」をクリック
3. 以下を入力:
   ```
   Repository name: mayurin-running-tracker
   Description: GPS対応のランニング記録PWAアプリ
   Public を選択
   □ Add a README file (チェックしない)
   □ Add .gitignore (チェックしない)
   □ Choose a license (チェックしない)
   ```
4. 「Create repository」をクリック

### 1.3 ローカルからプッシュ

ターミナルで以下を実行:

```bash
# プロジェクトディレクトリに移動
cd /Users/t.tsubasa/Desktop/Mayurin_roadtoKHM

# Gitの初期化（まだの場合）
git init

# すべてのファイルをステージング
git add .

# 最初のコミット
git commit -m "Initial commit: Complete running tracker PWA with all 4 phases"

# ブランチ名をmainに変更
git branch -M main

# リモートリポジトリを追加（YOUR_USERNAMEを自分のユーザー名に変更）
git remote add origin https://github.com/YOUR_USERNAME/mayurin-running-tracker.git

# プッシュ
git push -u origin main
```

**認証が求められた場合**:
- Username: GitHubのユーザー名
- Password: Personal Access Token（パスワードではない）

**Personal Access Tokenの作成**:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」→「Generate new token (classic)」
3. Note: `mayurin-deploy`
4. Expiration: `No expiration`
5. repo にチェック
6. 「Generate token」
7. トークンをコピー（この画面を閉じると見れなくなる）

---

## ステップ2: Vercelでデプロイ（5分）

### 2.1 Vercelアカウントの作成
1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択
4. GitHubで認証を許可

### 2.2 プロジェクトをインポート
1. Vercelのダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」セクションで `mayurin-running-tracker` を探す
3. 「Import」をクリック

### 2.3 ビルド設定の確認
以下が自動検出されます:
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Root Directory: ./
```

変更する必要はありません。

### 2.4 デプロイ
1. 「Deploy」ボタンをクリック
2. ビルドが開始される（1-3分）
3. 完了すると以下が表示される:
   ```
   🎉 Congratulations!

   Your project is now live at:
   https://your-project-name-xxx.vercel.app
   ```

---

## ステップ3: 動作確認（5分）

### 3.1 基本動作の確認
1. デプロイされたURLにアクセス
2. アプリが表示されることを確認
3. タイマーを開始
4. GPS許可を承認
5. 記録が保存されることを確認

### 3.2 PWA機能の確認

#### Chrome（デスクトップ）
1. F12でDevToolsを開く
2. **Application** タブをクリック
3. **Service Workers** を確認
   - `sw.js` が登録されている
   - Status: activated and is running
4. **Manifest** を確認
   - Name: まゆりんランニングトラッカー
   - Icons: 表示される

#### オフライン動作のテスト
1. DevToolsの **Network** タブ
2. **Offline** にチェック
3. ページをリロード
4. アプリが動作する ✓

#### インストールのテスト
1. アドレスバー右側の ⊕ アイコンをクリック
2. 「インストール」をクリック
3. スタンドアロンウィンドウが開く
4. ブラウザのUIがない状態で動作

#### モバイル（iOS Safari）
1. Safariでアクセス
2. 共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」をタップ
4. 「追加」をタップ
5. ホーム画面にアイコンが追加される

#### モバイル（Android Chrome）
1. Chromeでアクセス
2. メニュー（⋮）をタップ
3. 「ホーム画面に追加」または「インストール」をタップ
4. 「追加」をタップ

---

## 完了！ 🎉

アプリが本番環境で公開されました！

### 公開URL
```
https://your-project-name-xxx.vercel.app
```

このURLを友達や家族とシェアできます。

---

## 次のステップ（オプション）

### 独自ドメインを設定する
1. Vercel Project → Settings → Domains
2. カスタムドメインを入力
3. DNS設定を行う

### カスタマイズ
1. アイコンを自分のデザインに変更
2. アプリ名を変更
3. テーマカラーをカスタマイズ

### 更新をデプロイ
```bash
# コードを変更
git add .
git commit -m "Update: 変更内容"
git push

# Vercelが自動的に再デプロイ
# 数分後に更新が反映される
```

---

## トラブルシューティング

### ビルドが失敗する
1. ローカルで `npm run build` を実行
2. エラーを確認して修正
3. 再度プッシュ

### Service Workerが登録されない
1. HTTPSでアクセスしているか確認（Vercelは自動的にHTTPS）
2. ハードリロード（Ctrl+Shift+R / Cmd+Shift+R）
3. キャッシュをクリア

### GPSが動作しない
1. HTTPSでアクセスしているか確認
2. ブラウザの位置情報許可を確認
3. デバイスのGPS設定を確認

---

## サポート

問題が発生した場合:
1. ローカル環境（localhost）で正常に動作するか確認
2. ブラウザのコンソールでエラーを確認
3. Vercelのデプロイログを確認

---

## まとめ

**所要時間**: 15分
**コスト**: 無料
**結果**: 世界中からアクセス可能なPWAアプリ

これであなたのランニングトラッカーがインターネット上で公開されました！
