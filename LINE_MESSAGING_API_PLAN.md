# LINE Messaging API連携 + スケジュール機能 実装計画（改訂版）

## ⚠️ 重要な変更

LINE Notifyサービスが終了したため、**LINE Official Account（Messaging API）**を使用する実装に変更します。

## LINE Notify vs LINE Messaging API

| 項目 | LINE Notify（終了） | LINE Messaging API（新） |
|------|---------------------|-------------------------|
| 認証方式 | OAuth 2.0 | Webhook + 友だち追加 |
| トークン | ユーザーごとのアクセストークン | Channel Access Token（共通） |
| 通知方法 | 個人のLINEトークに通知 | 公式アカウントからPushメッセージ |
| 料金 | 無料 | 月1000通まで無料 |
| 設定難易度 | 簡単 | やや複雑 |

## アーキテクチャ概要

### 現状（実装済み・不要）
- LINE Notify OAuth認証 → **削除**
- トークン暗号化保存 → **変更**
- LINE Notify API連携 → **変更**

### 新規実装
1. **LINE公式アカウント作成**
2. **Messaging APIチャネル設定**
3. **Webhook受信エンドポイント**（友だち追加検知）
4. **Push API連携**（リマインダー送信）
5. **ユーザーID管理**（LINE User IDとFirebaseユーザーの紐付け）

---

## データモデル設計

### TypeScript型定義（変更）

```typescript
// LINE公式アカウントプロフィール
export interface LineMessagingProfile {
  lineUserId: string;           // LINE User ID
  isConnected: boolean;
  connectedAt: string;
  displayName?: string;         // LINEの表示名
  pictureUrl?: string;          // LINEのプロフィール画像
  lastNotificationSent?: string;
}

// 通知設定（同じ）
export interface NotificationPreferences {
  enabled: boolean;
  reminderMinutesBefore: number;
  notifyOnScheduleCreated: boolean;
  notifyOnScheduleCompleted: boolean;
}

// その他の型定義は同じ
```

### Firestoreコレクション構造（変更）

```
/users/{userId}
  - lineMessaging:
      - lineUserId: string              # LINE User ID
      - isConnected: boolean
      - connectedAt: Timestamp
      - displayName: string (optional)
      - pictureUrl: string (optional)
      - lastNotificationSent: Timestamp (optional)
  - notificationPreferences: { ... }    # 同じ

  /scheduledRuns/{scheduleId}           # 同じ

/lineUserMapping/{lineUserId}
  - firebaseUserId: string              # 逆引き用
  - createdAt: Timestamp
```

---

## LINE Official Account セットアップ

### 1. LINE Developersコンソールで設定

1. **プロバイダー作成**
   - https://developers.line.biz/console/ にアクセス
   - 新規プロバイダーを作成

2. **Messaging APIチャネル作成**
   - チャネルタイプ: Messaging API
   - チャネル名: `Mayurin Running Tracker`
   - チャネル説明: `ランニングスケジュールのリマインダー通知`
   - カテゴリ: スポーツ・フィットネス

3. **重要な情報をメモ**
   - **Channel ID**
   - **Channel Secret**
   - **Channel Access Token**（長期トークン）

4. **Webhook設定**
   - Webhook URL: `https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/lineWebhook`
   - Webhookの利用: ON
   - グループトーク参加: OFF（個人チャット専用）

5. **応答設定**
   - 応答メッセージ: OFF
   - Webhook: ON
   - あいさつメッセージ: カスタマイズ（後述）

### 2. あいさつメッセージ（友だち追加時）

```
こんにちは！Mayurin Running Trackerです🏃

この公式アカウントを友だち追加いただき、ありがとうございます！

【次のステップ】
1. Mayurin Running Trackerアプリを開く
2. 「スケジュール」→「設定」タブ
3. 「LINE連携」をタップ
4. 8桁の連携コードを入力

連携が完了すると、ランニングのリマインダーをお届けします💪
```

---

## 連携フロー設計

### フロー概要

#### 従来（LINE Notify - 不要）
```
1. ユーザーが「連携」ボタンクリック
2. LINE OAuth認証画面へリダイレクト
3. 承認後、コールバックでトークン取得
4. トークンをFirestoreに保存
```

#### 新方式（LINE Messaging API）
```
1. ユーザーがLINE公式アカウントを友だち追加
2. アプリで「連携コード」を表示（8桁のランダムコード）
3. ユーザーがLINEトークに連携コードを送信
4. Webhookで連携コードを受信
5. FirestoreでユーザーとLINE User IDを紐付け
6. 連携完了通知をLINEで送信
```

### 詳細フロー

#### ステップ1: 友だち追加
- ユーザーがQRコードをスキャン
- Webhook（follow イベント）が発火
- LINE User IDを取得
- 一時データとして保存（有効期限: 10分）

#### ステップ2: 連携コード生成
- アプリで8桁のコードを生成（例: `AB12CD34`）
- Firestoreに保存:
  ```
  /linkingCodes/{code}
    - firebaseUserId: string
    - createdAt: Timestamp
    - expiresAt: Timestamp  # 10分後
    - used: boolean
  ```

#### ステップ3: コード送信
- ユーザーがLINEトークに`AB12CD34`を送信
- Webhook（message イベント）が発火
- コードを検証
- FirebaseユーザーとLINE User IDを紐付け
- 連携完了メッセージを送信

---

## Cloud Functions 実装

### 必要な関数

#### 1. lineWebhook（HTTP Trigger - Webhook）

```typescript
export const lineWebhook = functions.https.onRequest(async (req, res) => {
  // LINE署名検証
  const signature = req.headers['x-line-signature'];
  if (!verifySignature(req.body, signature)) {
    return res.status(401).send('Invalid signature');
  }

  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'follow') {
      // 友だち追加時の処理
      await handleFollow(event);
    } else if (event.type === 'message' && event.message.type === 'text') {
      // メッセージ受信時の処理
      await handleMessage(event);
    } else if (event.type === 'unfollow') {
      // ブロック/削除時の処理
      await handleUnfollow(event);
    }
  }

  res.status(200).send('OK');
});
```

#### 2. generateLinkingCode（Callable）

```typescript
export const generateLinkingCode = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  // 8桁のランダムコード生成
  const code = generateRandomCode();

  // Firestoreに保存
  await admin.firestore().collection('linkingCodes').doc(code).set({
    firebaseUserId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000)),
    used: false,
  });

  return { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() };
});
```

#### 3. disconnectLineMessaging（Callable）

```typescript
export const disconnectLineMessaging = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  // Firestoreから削除
  await admin.firestore().collection('users').doc(userId).update({
    lineMessaging: admin.firestore.FieldValue.delete(),
  });

  return { success: true };
});
```

#### 4. checkScheduledRuns（Scheduled - 10分毎）

```typescript
export const checkScheduledRuns = functions.pubsub
  .schedule('every 10 minutes')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    const db = admin.firestore();

    // LINE連携済みユーザーを取得
    const usersSnapshot = await db.collection('users')
      .where('lineMessaging.isConnected', '==', true)
      .where('notificationPreferences.enabled', '==', true)
      .get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const lineUserId = userData.lineMessaging?.lineUserId;

      if (!lineUserId) continue;

      // スケジュールをチェックしてリマインダー送信
      await processUserReminders(userId, lineUserId, userData);
    }
  });
```

#### 5. sendLineMessage（内部関数）

```typescript
async function sendLineMessage(lineUserId: string, message: string): Promise<boolean> {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: lineUserId,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${channelAccessToken}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.error('LINE message send error:', error);
    return false;
  }
}
```

---

## フロントエンド実装（変更点）

### 1. LINE連携コンポーネント（変更）

`src/components/LineMessagingConnect.tsx`:

```typescript
export default function LineMessagingConnect({ profile, isConnected }: Props) {
  const [linkingCode, setLinkingCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const handleGenerateCode = async () => {
    const generateCode = httpsCallable(functions, 'generateLinkingCode');
    const result = await generateCode();
    setLinkingCode(result.data.code);
    setExpiresAt(new Date(result.data.expiresAt));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {!isConnected ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">LINE連携</h3>

          {/* ステップ1: 友だち追加 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium mb-2">ステップ1: 友だち追加</p>
            <p className="text-sm text-gray-600 mb-3">
              LINE公式アカウントを友だち追加してください
            </p>
            <div className="flex justify-center mb-3">
              {/* QRコード画像を表示 */}
              <img src="/line-qr-code.png" alt="QRコード" className="w-48 h-48" />
            </div>
            <a
              href="https://line.me/R/ti/p/@YOUR_LINE_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 bg-[#00B900] text-white text-center rounded-lg"
            >
              友だち追加
            </a>
          </div>

          {/* ステップ2: 連携コード */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">ステップ2: 連携コード</p>
            <p className="text-sm text-gray-600 mb-3">
              友だち追加後、連携コードを生成してLINEに送信
            </p>

            {!linkingCode ? (
              <button
                onClick={handleGenerateCode}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                連携コードを生成
              </button>
            ) : (
              <div>
                <div className="mb-3 p-4 bg-white border-2 border-blue-500 rounded-lg text-center">
                  <p className="text-xs text-gray-600 mb-1">連携コード</p>
                  <p className="text-3xl font-mono font-bold text-blue-600">
                    {linkingCode}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    有効期限: {expiresAt?.toLocaleTimeString('ja-JP')}まで
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  このコードをLINEトークに送信してください
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // 連携済みの表示
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">LINE連携済み</h3>
              {profile?.displayName && (
                <p className="text-sm text-gray-600">{profile.displayName}</p>
              )}
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            連携を解除
          </button>
        </div>
      )}
    </div>
  );
}
```

### 2. ユーティリティ（変更）

`src/utils/lineMessaging.ts`:

```typescript
import { functions } from '../config/firebase';
import { httpsCallable } from 'firebase/functions';

export async function generateLinkingCode(): Promise<{ code: string; expiresAt: string }> {
  const generateCode = httpsCallable(functions, 'generateLinkingCode');
  const result = await generateCode();
  return result.data as { code: string; expiresAt: string };
}

export async function disconnectLineMessaging(): Promise<void> {
  const disconnect = httpsCallable(functions, 'disconnectLineMessaging');
  await disconnect();
}
```

---

## 環境変数設定

### Firebase Functions

```bash
firebase functions:config:set \
  line.channel_id="YOUR_CHANNEL_ID" \
  line.channel_secret="YOUR_CHANNEL_SECRET" \
  line.channel_access_token="YOUR_CHANNEL_ACCESS_TOKEN"
```

### フロントエンド（不要）

LINE Messaging APIでは、フロントエンド用の環境変数は不要です（すべてバックエンドで処理）。

---

## セキュリティ

### 1. Webhook署名検証

```typescript
import * as crypto from 'crypto';

function verifySignature(body: any, signature: string): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET!;
  const hash = crypto
    .createHmac('sha256', channelSecret)
    .update(JSON.stringify(body))
    .digest('base64');
  return hash === signature;
}
```

### 2. 連携コードの有効期限

- 10分間のみ有効
- 使用済みコードは再利用不可
- Cloud Functionsで定期的にクリーンアップ

---

## 料金

### LINE Messaging API

- **無料プラン**: 月1000通まで無料
- **想定使用量**:
  - ユーザー100人 × 月30通 = 月3000通
  - → 有料プラン必要（¥5,000/月 + 従量課金）

- **個人利用**: 無料枠内で十分

### Firebase

- 同じ（変更なし）

---

## 実装手順

### Phase 1: LINE Official Account設定（Week 1）
1. LINE Developersコンソールでチャネル作成
2. Webhook URL設定
3. QRコード取得
4. あいさつメッセージ設定

### Phase 2: Cloud Functions実装（Week 2）
1. Webhook受信エンドポイント
2. 友だち追加ハンドラー
3. メッセージ受信ハンドラー
4. 連携コード生成関数
5. Push API連携

### Phase 3: フロントエンド更新（Week 3）
1. 連携UIの変更（OAuth → コード入力）
2. QRコード表示
3. 連携状態の表示
4. リアルタイム更新

### Phase 4: テストとデプロイ（Week 4）
1. ローカルテスト
2. Webhook動作確認
3. リマインダー送信テスト
4. 本番デプロイ

---

## まとめ

### 主な変更点

1. ✅ OAuth認証 → 友だち追加 + 連携コード
2. ✅ ユーザートークン → Channel Access Token（共通）
3. ✅ Notify API → Messaging API（Push）
4. ✅ Webhook実装が必須

### メリット

- より安定したLINE公式の機能
- リッチメッセージ対応可能
- 将来的な機能拡張が容易

### デメリット

- 設定がやや複雑
- 無料枠が限定的（月1000通）
- Webhook実装が必要

---

次のステップ: この新しいプランで実装を進めますか？それとも調整が必要ですか？
