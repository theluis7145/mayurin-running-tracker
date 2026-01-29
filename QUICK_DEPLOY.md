# クイックデプロイガイド

## ✅ 準備完了

- プロジェクトID: `mayurin-running-tracker`
- .firebasercファイル: 作成済み ✅
- Cloud Functions: ビルド済み ✅
- Firestoreルール: 準備完了 ✅

---

## 🚀 デプロイ手順（5ステップ）

### ステップ1: Firebaseにログイン

```bash
npx firebase-tools login
```

ブラウザが開くので、Googleアカウントでログイン

---

### ステップ2: LINE環境変数を設定

**重要**: `functions` ディレクトリ内に `.env` ファイルを作成します。

```bash
cd functions
```

以下の内容で `.env` ファイルを作成：

```env
LINE_CHANNEL_SECRET=YOUR_CHANNEL_SECRET
LINE_CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
```

**YOUR_CHANNEL_SECRET** と **YOUR_CHANNEL_ACCESS_TOKEN** を実際の値に置き換えてください。

💡 `.env` ファイルは `.gitignore` に含まれているため、Gitにコミットされません。

プロジェクトルートに戻る：

```bash
cd ..
```

---

### ステップ3: Firestoreルールをデプロイ

```bash
npx firebase-tools deploy --only firestore:rules
```

✅ `Deploy complete!` と表示されればOK

---

### ステップ4: Cloud Functionsをデプロイ

```bash
npx firebase-tools deploy --only functions
```

⏰ 5〜10分かかります

完了すると、以下のような出力が表示されます：

```
Function URL (lineWebhook): https://asia-northeast1-mayurin-running-tracker.cloudfunctions.net/lineWebhook
```

💡 **lineWebhookのURLをメモしてください**

---

### ステップ5: LINE DevelopersでWebhook URLを設定

1. LINE Developers Console → Messaging API設定タブ
2. Webhook URL欄に、コピーしたURLを貼り付け
3. 「更新」をクリック
4. 「Webhookの利用」を**ON**
5. 「検証」ボタンをクリック → ✅ Success

応答設定:
- 応答メッセージ: **OFF**
- Webhook: **ON**

---

## 📌 コマンド一覧（コピペ用）

```bash
# 1. ログイン
npx firebase-tools login

# 2. functions/.env ファイルを作成
cd functions
cat > .env << 'EOF'
LINE_CHANNEL_SECRET=YOUR_CHANNEL_SECRET
LINE_CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
EOF
cd ..

# 3. Firestoreルール
npx firebase-tools deploy --only firestore:rules

# 4. Cloud Functions
npx firebase-tools deploy --only functions
```

**注意**: `YOUR_CHANNEL_SECRET` と `YOUR_CHANNEL_ACCESS_TOKEN` を実際の値に置き換えてください。

---

準備は完了しています！
**ステップ1のログイン**から始めてください 🚀
