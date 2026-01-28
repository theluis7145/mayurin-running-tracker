# 本番環境デプロイプラン

## 概要

まゆりんランニングトラッカーを本番環境にデプロイするための完全なプランです。

---

## フェーズ1: デプロイ準備（所要時間: 30分）

### 1.1 デプロイ先の選択

#### 推奨オプション1: Vercel（最も簡単）★推奨★

**メリット**:
- 無料プランで十分
- 自動デプロイ（Gitプッシュで自動更新）
- HTTPS自動対応
- CDN配信で高速
- 無料の.vercel.appドメイン
- ビルドエラー時の通知

**デメリット**:
- なし（このプロジェクトには最適）

**料金**: 無料（個人プロジェクトなら十分）

#### オプション2: Netlify

**メリット**:
- 無料プランで十分
- 自動デプロイ
- フォーム機能（将来的に使える）
- 無料の.netlify.appドメイン

**料金**: 無料

#### オプション3: GitHub Pages

**メリット**:
- 完全無料
- GitHubアカウントのみで可能

**デメリット**:
- SPAのルーティング設定が必要
- ビルド設定が少し複雑

**料金**: 無料

---

## フェーズ2: Vercelでのデプロイ手順（推奨）

### 2.1 事前準備

1. **GitHubアカウントの作成**（まだない場合）
   - https://github.com にアクセス
   - 無料アカウントを作成

2. **Vercelアカウントの作成**
   - https://vercel.com にアクセス
   - 「Sign Up」をクリック
   - GitHubアカウントで連携

### 2.2 リポジトリの作成

```bash
# 1. Gitの初期化（まだの場合）
cd /Users/t.tsubasa/Desktop/Mayurin_roadtoKHM
git init

# 2. .gitignoreの確認（既に作成済み）
# node_modules, distなどが含まれていることを確認

# 3. 最初のコミット
git add .
git commit -m "Initial commit: Complete running tracker app with PWA support"

# 4. GitHubでリポジトリを作成
# https://github.com/new にアクセス
# リポジトリ名: mayurin-running-tracker
# Public or Private を選択
# 「Create repository」をクリック

# 5. リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/mayurin-running-tracker.git
git branch -M main
git push -u origin main
```

### 2.3 Vercelでデプロイ

1. **Vercelにログイン**
   - https://vercel.com にアクセス
   - GitHubアカウントでログイン

2. **新規プロジェクトの作成**
   - 「Add New...」→「Project」をクリック
   - GitHubリポジトリから「mayurin-running-tracker」を選択
   - 「Import」をクリック

3. **ビルド設定の確認**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
   - これらは自動検出されるはずです

4. **デプロイ**
   - 「Deploy」ボタンをクリック
   - 数分でデプロイ完了
   - `https://your-project-name.vercel.app` のURLが発行される

### 2.4 デプロイ確認

1. 発行されたURLにアクセス
2. アプリが正常に動作することを確認
3. PWA機能の確認:
   - Service Workerが登録される
   - オフライン動作
   - インストール可能

---

## フェーズ3: カスタムドメイン設定（オプション）

### 3.1 独自ドメインの取得

**推奨レジストラ**:
- お名前.com（日本語対応）
- Google Domains
- Cloudflare

**料金**: 年間1,000〜3,000円程度

### 3.2 Vercelでドメイン設定

1. Vercelプロジェクトの「Settings」→「Domains」
2. カスタムドメインを入力
3. DNS設定をレジストラで行う:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. 数分〜24時間で反映

---

## フェーズ4: 本番環境の最適化

### 4.1 パフォーマンス最適化

#### 画像の最適化
```bash
# 現在のアイコンは仮のもの
# 実際のアイコンを作成する場合:
# - 192x192px、512x512px のPNG画像
# - TinyPNG等で圧縮
```

#### Lighthouseスコアの確認
```bash
# Chrome DevTools → Lighthouse
# Performance、Accessibility、Best Practices、SEO、PWAを測定
# 目標: すべて90点以上
```

### 4.2 SEO対策

#### index.htmlの更新
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0ea5e9" />
  <meta name="description" content="GPSでランニングを記録し、励ましメッセージで応援するPWAアプリ" />
  <meta name="keywords" content="ランニング,GPS,記録,トラッカー,PWA,ジョギング" />

  <!-- OGP (SNSシェア用) -->
  <meta property="og:title" content="まゆりんランニングトラッカー" />
  <meta property="og:description" content="GPSでランニングを記録し、励ましメッセージで応援するPWAアプリ" />
  <meta property="og:image" content="https://your-domain.com/pwa-512x512.png" />
  <meta property="og:url" content="https://your-domain.com" />
  <meta property="og:type" content="website" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="まゆりんランニングトラッカー" />
  <meta name="twitter:description" content="GPSでランニングを記録し、励ましメッセージで応援するPWAアプリ" />

  <title>まゆりんランニングトラッカー - GPS対応ランニング記録アプリ</title>
</head>
```

#### robots.txt（任意）
```txt
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://your-domain.com/sitemap.xml
```

### 4.3 セキュリティ対策

#### HTTPSの確認
- Vercelは自動的にHTTPSを有効化
- Let's Encrypt証明書を自動更新

#### Content Security Policy（CSP）
```javascript
// vercel.json（オプション）
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## フェーズ5: 継続的デプロイ（CI/CD）の設定

### 5.1 自動デプロイの設定

Vercelは自動的にGitHubと連携しているため:

1. **mainブランチにプッシュ** → 本番環境に自動デプロイ
2. **他のブランチにプッシュ** → プレビュー環境を自動生成
3. **Pull Request作成** → プレビューURLを自動コメント

### 5.2 デプロイフロー

```bash
# 開発フロー
git checkout -b feature/new-feature
# コード変更
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# GitHubでPull Request作成
# Vercelが自動的にプレビュー環境を生成
# プレビューURLで確認

# 問題なければマージ
# mainブランチに自動デプロイ
```

---

## フェーズ6: 監視とメンテナンス

### 6.1 アクセス解析

#### Google Analytics（オプション）

```bash
npm install react-ga4
```

```typescript
// src/main.tsx
import ReactGA from 'react-ga4';

if (import.meta.env.PROD) {
  ReactGA.initialize('YOUR_MEASUREMENT_ID');
}
```

#### Vercel Analytics（推奨）

```bash
npm install @vercel/analytics
```

```typescript
// src/main.tsx
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
);
```

### 6.2 エラー監視

#### Sentry（オプション）

```bash
npm install @sentry/react @sentry/vite-plugin
```

無料プランで月間5,000エラーまで追跡可能。

### 6.3 アップデート計画

**月次チェックリスト**:
- [ ] 依存関係の更新（`npm outdated` → `npm update`）
- [ ] セキュリティ脆弱性のチェック（`npm audit`）
- [ ] ユーザーフィードバックの確認
- [ ] パフォーマンス測定（Lighthouse）

**四半期チェックリスト**:
- [ ] 新機能の検討
- [ ] UIの改善
- [ ] バックアップの確認

---

## フェーズ7: バックアップと復旧

### 7.1 データバックアップ

ユーザーデータはLocalStorageに保存されているため:

1. **エクスポート機能の追加（推奨）**:
```typescript
// 将来的に追加
function exportData() {
  const data = {
    profile: loadProfile(),
    records: loadRunRecords(),
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mayurin-backup-${new Date().toISOString()}.json`;
  a.click();
}
```

2. **インポート機能の追加**:
```typescript
function importData(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target?.result as string);
    // データを復元
  };
  reader.readAsText(file);
}
```

### 7.2 コードバックアップ

- GitHubリポジトリが自動バックアップ
- Vercelはデプロイ履歴を保持（ロールバック可能）

---

## フェーズ8: スケーリング計画

### 8.1 ユーザー数に応じた対応

**〜1,000ユーザー**:
- 現在の構成で十分
- Vercelの無料プランで対応可能

**1,000〜10,000ユーザー**:
- Vercel Proプラン（月$20）を検討
- バックエンドAPI追加を検討（Firebase、Supabase）
- クラウドストレージ（記録の同期）

**10,000ユーザー〜**:
- 専用バックエンドの構築
- データベース（PostgreSQL、MongoDB）
- スケーラブルなインフラ（AWS、GCP）

### 8.2 機能追加のロードマップ

**短期（1-3ヶ月）**:
- [ ] データエクスポート/インポート機能
- [ ] SNSシェア機能
- [ ] 多言語対応（英語）

**中期（3-6ヶ月）**:
- [ ] クラウド同期（Firebase）
- [ ] ソーシャルログイン
- [ ] 友達機能

**長期（6-12ヶ月）**:
- [ ] コミュニティ機能
- [ ] チャレンジイベント
- [ ] ウェアラブルデバイス連携

---

## チェックリスト: デプロイ前の最終確認

### コードの確認
- [ ] すべてのPhaseが実装されている
- [ ] ビルドエラーがない（`npm run build`）
- [ ] TypeScriptエラーがない（`npm run lint`）
- [ ] 開発サーバーで正常動作（`npm run dev`）
- [ ] プレビューで正常動作（`npm run preview`）

### 機能の確認
- [ ] タイマーが正常動作
- [ ] GPS追跡が動作
- [ ] 地図表示が正常
- [ ] 記録保存が動作
- [ ] 履歴表示が正常
- [ ] プロフィール設定が保存される
- [ ] PWAとしてインストール可能
- [ ] オフラインで動作

### セキュリティの確認
- [ ] 個人情報を外部送信していない
- [ ] APIキーが公開されていない
- [ ] .gitignoreが適切に設定されている

### パフォーマンスの確認
- [ ] Lighthouseスコア80点以上
- [ ] 初回読み込みが3秒以内
- [ ] PWAスコア90点以上

---

## 即座に実行可能な手順

### ステップバイステップ（今すぐできる）

```bash
# 1. Gitリポジトリの初期化
cd /Users/t.tsubasa/Desktop/Mayurin_roadtoKHM
git init
git add .
git commit -m "Initial commit: Complete running tracker PWA"

# 2. GitHubでリポジトリを作成
# https://github.com/new
# リポジトリ名: mayurin-running-tracker
# Public を選択
# Create repository

# 3. リモートリポジトリを追加してプッシュ
git remote add origin https://github.com/YOUR_USERNAME/mayurin-running-tracker.git
git branch -M main
git push -u origin main

# 4. Vercelでデプロイ
# https://vercel.com
# Sign Up with GitHub
# Import Project → mayurin-running-tracker を選択
# Deploy ボタンをクリック

# 完了！
# 数分後に https://your-project.vercel.app でアクセス可能
```

---

## コスト見積もり

### 無料で運用する場合
- **ホスティング**: Vercel無料プラン（$0）
- **ドメイン**: .vercel.appドメイン（$0）
- **合計**: **$0/月**

### 独自ドメインを使う場合
- **ホスティング**: Vercel無料プラン（$0）
- **ドメイン**: .com/.jp等（年間$10-30、月$1-3）
- **合計**: **$1-3/月**

### 将来的にスケールする場合
- **ホスティング**: Vercel Pro（$20/月）
- **ドメイン**: （$1-3/月）
- **バックエンド**: Firebase/Supabase無料プラン（$0-25/月）
- **合計**: **$20-50/月**

---

## サポートとドキュメント

### ユーザー向けドキュメント
- 使い方ガイド（アプリ内のプロフィール画面に記載済み）
- FAQ（将来的に追加）
- お問い合わせフォーム（将来的に追加）

### 開発者向けドキュメント
- README.md（作成済み）
- PHASE1-4_COMPLETE.md（作成済み）
- このDEPLOYMENT_PLAN.md

---

## まとめ

**最短デプロイ手順**:
1. GitHubアカウント作成
2. リポジトリ作成してプッシュ
3. Vercelアカウント作成
4. Vercelでインポート＆デプロイ
5. 完了！（所要時間: 15-30分）

**推奨される手順**:
1. 上記の最短手順を実行
2. 独自ドメインを取得（オプション）
3. SEO対策を実施
4. アクセス解析を追加
5. ユーザーフィードバックを収集
6. 継続的に改善

**次のステップ**:
- [ ] GitHubリポジトリを作成
- [ ] Vercelでデプロイ
- [ ] 動作確認
- [ ] URLをシェア

---

質問や不明点があれば、いつでも聞いてください！
