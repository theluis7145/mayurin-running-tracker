# 認証機能実装完了レポート

## 実装概要

Firebase Authentication と Firestore を使用して、ユーザー登録・ログイン機能とマルチデバイス同期を実装しました。

## 実装内容

### Phase 1: Firebase セットアップ ✅

**新規作成ファイル:**
- `src/config/firebase.ts` - Firebase初期化とオフライン永続化設定
- `.env.local` - Firebase設定用環境変数（要設定）
- `.env.example` - 環境変数のサンプル
- `FIREBASE_SETUP.md` - Firebase設定手順書

**依存関係追加:**
```bash
npm install firebase
```

### Phase 2: 認証機能実装 ✅

**新規作成ファイル:**
- `src/contexts/AuthContext.tsx` - 認証状態管理コンテキスト
- `src/utils/authErrors.ts` - Firebase認証エラーの日本語化
- `src/pages/Login.tsx` - ログインページ
- `src/pages/Signup.tsx` - サインアップページ
- `src/components/PasswordInput.tsx` - パスワード表示/非表示トグル付き入力コンポーネント
- `src/components/ProtectedRoute.tsx` - 認証ガード

**更新ファイル:**
- `src/types/index.ts` - `AuthUser` と `AuthError` 型を追加
- `src/App.tsx` - `AuthProvider`、ログイン/サインアップルート、`ProtectedRoute` を追加
- `src/pages/Profile.tsx` - ログアウトボタンとアカウント情報表示を追加

### Phase 3: Firestore データ同期 ✅

**新規作成ファイル:**
- `src/utils/firestore.ts` - Firestore CRUD操作とリアルタイム同期

**更新ファイル:**
- `src/hooks/useProfile.ts` - LocalStorageからFirestoreへ移行、リアルタイム同期対応
- `src/pages/Home.tsx` - 走行記録をFirestoreに保存
- `src/pages/History.tsx` - Firestoreから記録を読み込み、リアルタイム更新
- `src/pages/RecordDetail.tsx` - Firestoreから記録詳細を読み込み、削除

**削除対象ファイル（オプション）:**
- `src/utils/storage.ts` - もう使用されていませんが、削除は任意

## 機能詳細

### 認証機能

1. **サインアップ (`/signup`)**
   - ニックネーム入力
   - メールアドレス入力（形式バリデーション付き）
   - パスワード入力（6文字以上、表示/非表示トグル）
   - パスワード確認入力
   - エラーメッセージの日本語表示

2. **ログイン (`/login`)**
   - メールアドレス入力
   - パスワード入力（表示/非表示トグル）
   - エラーメッセージの日本語表示

3. **ログアウト**
   - プロフィール画面にログアウトボタンを追加
   - 確認ダイアログ表示

4. **認証ガード**
   - 未ログイン時は自動的に `/login` へリダイレクト
   - ホーム、履歴、記録詳細、プロフィールは認証必須

### データ同期

1. **プロフィール**
   - Firestoreでリアルタイム同期
   - デバイス間で自動更新

2. **走行記録**
   - 新規記録はFirestoreに保存
   - 履歴はリアルタイム監視
   - 削除も即座に全デバイスに反映

3. **オフライン対応**
   - IndexedDB による永続化
   - オフライン時もローカルキャッシュで動作
   - 再接続時に自動同期

## データモデル

### Firestore コレクション構造

```
/users/{userId}
  - nickname: string
  - email: string
  - avatarBase64: string (optional)
  - createdAt: Timestamp
  - updatedAt: Timestamp

/users/{userId}/runRecords/{recordId}
  - startTime: Timestamp
  - endTime: Timestamp
  - duration: number
  - distance: number
  - averagePace: number
  - laps: Array<Lap>
  - coordinates: Array<Coordinate>
  - createdAt: Timestamp
```

### セキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /runRecords/{recordId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## セットアップ手順

### 1. Firebase プロジェクト設定

詳細は `FIREBASE_SETUP.md` を参照してください。

**要点:**
1. [Firebase Console](https://console.firebase.google.com/) でプロジェクト作成
2. Authentication でメール/パスワード認証を有効化
3. Firestore Database を作成（東京リージョン推奨）
4. セキュリティルールを設定
5. Web アプリを追加して設定情報を取得

### 2. 環境変数設定

`.env.local` ファイルに Firebase 設定を追加:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. ローカルテスト

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開き、サインアップ → ログイン → データ保存 → ログアウト → ログイン → データ確認の流れをテスト。

### 4. Vercel デプロイ

Vercel の Environment Variables に `.env.local` と同じ変数を追加してデプロイ。

## 変更点

### LocalStorage → Firestore 移行

**Before:**
```typescript
// src/utils/storage.ts
saveRunRecord(record);
const records = loadRunRecords();
```

**After:**
```typescript
// src/utils/firestore.ts
await saveRunRecord(userId, record);
subscribeToRunRecords(userId, (records) => { /* リアルタイム更新 */ });
```

### 既存データについて

LocalStorage の既存データ (`mayurin_user_profile`, `mayurin_run_records`) は**破棄**されます。
ユーザー確認済みのテストデータのため、問題ありません。

初回ログイン後、LocalStorage を手動でクリアすることも可能:
```javascript
localStorage.clear();
```

## ユーザーフロー

### 初回訪問時

1. アプリを開く → `/login` にリダイレクト
2. 「新規登録」リンクをクリック → `/signup` へ
3. ニックネーム、メール、パスワードを入力してサインアップ
4. 自動的にログインし、ホーム画面 (`/`) へ

### 2回目以降

1. アプリを開く
2. ログイン状態が保持されていればそのままホーム画面へ
3. ログアウトしていれば `/login` へリダイレクト

### マルチデバイス同期

1. デバイスA でランニング記録を保存
2. デバイスB で同じアカウントでログイン
3. デバイスB の履歴に記録が自動表示（リアルタイム）

## エラーハンドリング

### 認証エラーの日本語化

| Firebase エラーコード | 日本語メッセージ |
|---------------------|----------------|
| `auth/email-already-in-use` | このメールアドレスは既に登録されています |
| `auth/invalid-email` | メールアドレスの形式が正しくありません |
| `auth/user-not-found` | ユーザーが見つかりません |
| `auth/wrong-password` | パスワードが間違っています |
| `auth/weak-password` | パスワードは6文字以上で設定してください |
| `auth/network-request-failed` | ネットワークエラーが発生しました |

### Firestore エラー

- **permission-denied**: セキュリティルールで拒否（他人のデータアクセス試行）
- **unavailable**: ネットワークエラー、オフライン
- **not-found**: ドキュメントが見つかりません

## コスト見積もり

### Firebase 無料枠（Spark Plan）

- **Authentication**: 10,000ユーザー、月間50,000認証リクエスト ✅
- **Firestore**: 1GB storage、50,000 reads/日、20,000 writes/日 ✅

**結論**: 個人利用なら完全無料で運用可能

## セキュリティ対策

1. **パスワード管理**: Firebase が bcrypt で自動ハッシュ化
2. **トークン管理**: JWT トークンの自動リフレッシュ
3. **HTTPS 通信**: Firebase と Vercel で強制
4. **データアクセス制御**: Firestore セキュリティルールでユーザーごとに分離
5. **環境変数**: `.env.local` は `.gitignore` でコミット防止

## テスト手順

### 認証テスト

1. サインアップで新規ユーザー作成
2. ログアウト
3. 間違ったパスワードでログイン → エラーメッセージ確認
4. 正しいパスワードでログイン成功
5. パスワード表示/非表示トグル動作確認

### データ同期テスト

1. ランニングを記録して保存
2. 履歴画面で記録を確認
3. 記録詳細を開いて地図とデータを確認
4. 記録を削除
5. 別のブラウザ/デバイスで同じアカウントでログイン
6. 記録が同期されていることを確認

### セキュリティテスト

1. ユーザーAでログイン
2. DevTools Console で他人のデータアクセスを試行:
   ```javascript
   firebase.firestore().collection('users').doc('他人のUID').get()
   ```
3. `permission-denied` エラーが発生することを確認

## トラブルシューティング

### ビルドエラー

```bash
npm run build
```

エラーが出る場合は TypeScript の型エラーを確認。

### 認証エラー

- Firebase Console で「メール/パスワード」認証が有効か確認
- `.env.local` の環境変数が正しく設定されているか確認

### Firestore エラー

- セキュリティルールが正しく設定されているか確認
- ネットワーク接続を確認

### デプロイ後に動作しない

- Vercel の Environment Variables が正しく設定されているか確認
- ブラウザの Console でエラーメッセージを確認

## 次のステップ（オプション）

1. **パスワードリセット機能**: `sendPasswordResetEmail()` で実装可能
2. **メールアドレス変更**: `updateEmail()` で実装可能
3. **ソーシャルログイン**: Google、Apple ログイン追加
4. **プロフィール画像を Firebase Storage へ**: Base64 より効率的
5. **共有機能**: 記録を友達とシェア
6. **ランキング機能**: 全ユーザーの統計集計
7. **プッシュ通知**: Firebase Cloud Messaging で走行リマインダー

## 完了した実装

- ✅ Firebase Authentication セットアップ
- ✅ メール/パスワード認証
- ✅ ログイン/サインアップ画面
- ✅ パスワード表示/非表示トグル
- ✅ 認証ガード（ProtectedRoute）
- ✅ ログアウト機能
- ✅ Firestore Database セットアップ
- ✅ プロフィールのFirestore同期
- ✅ 走行記録のFirestore同期
- ✅ リアルタイム同期
- ✅ オフライン対応
- ✅ セキュリティルール設定
- ✅ エラーメッセージ日本語化
- ✅ Nike風ダークテーマ維持
- ✅ ビルド成功

## 注意事項

**重要**: アプリを起動する前に、必ず `FIREBASE_SETUP.md` の手順に従って Firebase プロジェクトを設定し、`.env.local` に環境変数を追加してください。
