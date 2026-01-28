# Firebase セットアップガイド

## 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: mayurin-running-tracker）
4. Google Analyticsは任意（スキップ可能）
5. プロジェクトを作成

## 2. Firebase Authentication の設定

1. 左メニューから「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブを選択
4. 「メール/パスワード」を選択して有効化
5. 保存

## 3. Firestore Database の作成

1. 左メニューから「Firestore Database」を選択
2. 「データベースの作成」をクリック
3. ロケーションを選択（推奨: asia-northeast1 - 東京）
4. **本番モードで開始**を選択（セキュリティルールは次のステップで設定）
5. 「有効にする」をクリック

## 4. Firestore セキュリティルールの設定

1. Firestore Databaseの「ルール」タブを選択
2. 以下のルールを貼り付け:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のドキュメントのみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // 走行記録も自分のもののみアクセス可能
      match /runRecords/{recordId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. 「公開」をクリック

## 5. Firebase Web アプリの追加

1. プロジェクトの概要ページに戻る
2. 「アプリを追加」から「Web（</>）」を選択
3. アプリのニックネームを入力（例: mayurin-web）
4. 「Firebase Hosting」のチェックは不要
5. 「アプリを登録」をクリック
6. Firebase SDK設定が表示されるので、以下の値をコピー:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## 6. 環境変数の設定

1. プロジェクトルートの `.env.local` ファイルを開く
2. コピーした値を以下のように貼り付け:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. ファイルを保存

## 7. ローカルでテスト

```bash
npm run dev
```

1. ブラウザで http://localhost:5173 を開く
2. サインアップページが表示されることを確認
3. 新規ユーザーを登録してテスト

## 8. Vercel へのデプロイ

1. Vercelのプロジェクト設定を開く
2. 「Environment Variables」セクションに移動
3. `.env.local` と同じ環境変数を追加:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. 変数を保存
5. 再デプロイ

## セキュリティ注意事項

- **重要**: `.env.local` ファイルは `.gitignore` に含まれているため、Gitにコミットされません
- Firebase Web APIキーは公開されても問題ありません（Firestoreセキュリティルールで保護されます）
- ただし、環境変数としてGitHubに直接コミットしないよう注意してください

## トラブルシューティング

### エラー: "Firebase: Error (auth/configuration-not-found)"
→ `.env.local` の環境変数が正しく設定されているか確認

### エラー: "Missing or insufficient permissions"
→ Firestoreセキュリティルールが正しく設定されているか確認

### 認証エラー
→ Firebase Consoleで「メール/パスワード」認証が有効化されているか確認

### ネットワークエラー
→ Firebase プロジェクトの課金プラン（無料のSparkプランで十分）を確認
