# LINE Messaging API セットアップガイド

Mayurin Running TrackerにLINE公式アカウントを使ったリマインダー通知機能を追加する手順を説明します。

## 📋 前提条件

- Firebaseプロジェクト（既存のもの）
- LINEアカウント
- LINE Developersアカウント

## 🚀 セットアップ手順

### ステップ1: LINE Developersでチャネルを作成（15分）

#### 1-1. LINE Developersコンソールにアクセス

https://developers.line.biz/console/ にアクセスしてログイン

#### 1-2. プロバイダーを作成

1. 「プロバイダーを作成」をクリック
2. プロバイダー名: `Mayurin Running Tracker`（任意）
3. 作成

#### 1-3. Messaging APIチャネルを作成

1. 作成したプロバイダーを選択
2. 「チャネルを作成」→「Messaging API」を選択
3. 必要事項を入力:
   - **チャネル名**: `Mayurin Running Tracker`
   - **チャネル説明**: `ランニングスケジュールのリマインダー通知`
   - **大業種**: スポーツ・アウトドア
   - **小業種**: スポーツ施設・スポーツスクール
   - **メールアドレス**: あなたのメールアドレス
4. 利用規約に同意して作成

#### 1-4. 重要な情報をメモ

チャネル基本設定ページから以下をコピー:

1. **Channel ID** (「チャネル基本設定」タブ)
2. **Channel Secret** (「チャネル基本設定」タブ)
3. **Channel Access Token（長期）** (「Messaging API設定」タブ)
   - まだ発行されていない場合は「発行」ボタンをクリック

### ステップ2: Webhook設定（5分）

「Messaging API設定」タブで以下を設定:

#### 2-1. Webhook URL

```
https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/lineWebhook
```

例: `https://asia-northeast1-mayurin-running-tracker.cloudfunctions.net/lineWebhook`

**注意**: まだCloud Functionsをデプロイしていない場合は、このステップは後で行います。

#### 2-2. Webhookの利用

「編集」→「ON」に設定

#### 2-3. 応答設定

「LINE公式アカウント機能」の「編集」をクリック:

- **あいさつメッセージ**: ON（カスタマイズ - 後述）
- **応答メッセージ**: OFF
- **Webhook**: ON

### ステップ3: あいさつメッセージ設定（5分）

LINE Official Account Managerで設定:

1. 「応答設定」→「あいさつメッセージ」
2. 以下のメッセージを設定:

```
こんにちは！Mayurin Running Trackerです🏃

この公式アカウントを友だち追加いただき、ありがとうございます！

【次のステップ】
1. Mayurin Running Trackerアプリを開く
2. 「スケジュール」→「設定」タブ
3. 「連携コードを生成」をタップ
4. 表示された8桁のコードをこのトークに送信

連携が完了すると、ランニングのリマインダーをお届けします💪
```

### ステップ4: Firebase Functions環境変数の設定（5分）

プロジェクトルートで以下を実行:

```bash
firebase functions:config:set \
  line.channel_id="ステップ1-4で取得したChannel ID" \
  line.channel_secret="ステップ1-4で取得したChannel Secret" \
  line.channel_access_token="ステップ1-4で取得したChannel Access Token"
```

#### 設定確認

```bash
firebase functions:config:get
```

以下のように表示されればOK:

```json
{
  "line": {
    "channel_id": "YOUR_CHANNEL_ID",
    "channel_secret": "YOUR_CHANNEL_SECRET",
    "channel_access_token": "YOUR_CHANNEL_ACCESS_TOKEN"
  }
}
```

### ステップ5: Firestoreセキュリティルールのデプロイ（1分）

```bash
firebase deploy --only firestore:rules
```

### ステップ6: Cloud Functionsのデプロイ（5分）

```bash
# Functionsディレクトリで依存関係をインストール（初回のみ）
cd functions
npm install

# ビルド
npm run build

# デプロイ
cd ..
firebase deploy --only functions
```

デプロイされる関数:

- `lineWebhook` - LINE Webhook エンドポイント
- `generateLinkingCode` - 連携コード生成
- `disconnectLineMessaging` - LINE連携解除
- `cleanupExpiredLinkingCodes` - 期限切れコードのクリーンアップ（毎日3:00）
- `checkScheduledRuns` - スケジュールチェック（10分毎）

#### Webhook URLの更新

デプロイ後、出力されたURLをLINE Developersコンソールに設定:

```
Function URL (lineWebhook): https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/lineWebhook
```

このURLをLINE Developersの「Webhook URL」に貼り付けて保存

### ステップ7: フロントエンドのデプロイ（3分）

#### Vercelの場合

```bash
git add .
git commit -m "Add LINE Messaging API integration"
git push
```

Vercelが自動的にデプロイします。

#### Firebase Hostingの場合

```bash
npm run build
firebase deploy --only hosting
```

## ✅ 動作確認

### 1. LINE公式アカウントのQRコード取得

LINE Official Account Managerから:

1. 「ホーム」→「友だち追加ガイド」
2. QRコードをダウンロード
3. `public/line-qr-code.png`として保存（アプリで表示用）

### 2. 連携テスト

1. アプリにログイン
2. 「SCHEDULE」タブを開く
3. 「設定」タブを開く
4. 「友だち追加」ボタンから公式アカウントを追加
5. 「連携コードを生成」をタップ
6. 表示された8桁のコードをLINEトークに送信
7. 「連携が完了しました！」メッセージが届くことを確認

### 3. リマインダーテスト

1. 「マイスケジュール」タブで新しいスケジュールを作成
2. 10分後の時刻を設定
3. 保存
4. 1時間前（デフォルト設定）にLINE通知が届くことを確認

※ テスト用に「15分前」に設定することをお勧めします

## 🔍 トラブルシューティング

### Webhook接続エラー

**症状**: LINE Developersで「接続確認」が失敗する

**確認ポイント**:
1. Cloud Functionsが正常にデプロイされているか
   ```bash
   firebase functions:log --only lineWebhook
   ```
2. Webhook URLが正しいか（リージョンとプロジェクトIDを確認）
3. Cloud FunctionsがHTTPSで公開されているか

### 連携コードが認識されない

**症状**: LINEにコードを送っても反応がない

**確認ポイント**:
1. コードが正しい形式か（8桁の英数字）
2. コードの有効期限（10分）が切れていないか
3. Webhookが正常に動作しているか
   ```bash
   firebase functions:log --only lineWebhook
   ```

### リマインダーが届かない

**症状**: スケジュールを作成したが通知が来ない

**確認ポイント**:
1. LINE連携が完了しているか（「設定」タブで確認）
2. 通知設定が有効になっているか
3. スケジュールがアクティブ（ON）になっているか
4. `checkScheduledRuns`が正常に動作しているか
   ```bash
   firebase functions:log --only checkScheduledRuns
   ```

### 環境変数が見つからないエラー

**症状**: Cloud Functionsで`LINE_CHANNEL_SECRET is not set`エラー

**解決方法**:
```bash
# 環境変数を再設定
firebase functions:config:set \
  line.channel_id="..." \
  line.channel_secret="..." \
  line.channel_access_token="..."

# 再デプロイ
firebase deploy --only functions
```

## 💰 料金

### LINE Messaging API

- **無料プラン**: 月1000通まで無料
- **有料プラン**: 月5,000円 + 従量課金

**想定使用量**（ユーザー100人）:
- 1人あたり月30通 = 3,000通/月
- → 有料プランが必要（個人利用なら無料枠で十分）

### Firebase

既存と同じ（追加コストなし）

## 🔒 セキュリティ

### Webhook署名検証

すべてのWebhookリクエストはLINEの署名を検証:

```typescript
// functions/src/line-messaging/signature.ts
const hash = crypto
  .createHmac('sha256', channelSecret)
  .update(body)
  .digest('base64');

return hash === signature;
```

### 連携コード

- 8桁のランダムコード（紛らわしい文字を除外）
- 有効期限: 10分
- 使用済みコードは再利用不可
- 毎日自動クリーンアップ

### Firestoreセキュリティルール

ユーザーは自分のデータのみアクセス可能

## 📱 ユーザー向け使い方

### LINE連携方法

1. アプリの「スケジュール」→「設定」タブを開く
2. 「友だち追加」ボタンから公式アカウントを追加
3. 「連携コードを生成」をタップ
4. 表示された8桁のコードをLINEトークに送信
5. 連携完了メッセージが届いたら完了

### スケジュール作成

1. 「スケジュール」→「マイスケジュール」タブ
2. 「新しいスケジュールを作成」をタップ
3. タイトル、日時、繰り返し設定などを入力
4. 「作成」をタップ

### 通知設定

1. 「設定」タブを開く
2. 「通知を有効にする」をON
3. 「リマインダータイミング」で通知時刻を選択
4. 「設定を保存」をタップ

## 📚 参考リンク

- [LINE Messaging API ドキュメント](https://developers.line.biz/ja/docs/messaging-api/)
- [Firebase Cloud Functions ドキュメント](https://firebase.google.com/docs/functions)
- [LINE Webhook 仕様](https://developers.line.biz/ja/reference/messaging-api/#webhook-event-objects)

## 🎉 完了

これでLINE Messaging API連携の設定が完了しました！

ユーザーはアプリでスケジュールを作成すると、LINEでリマインダー通知を受け取れます。
