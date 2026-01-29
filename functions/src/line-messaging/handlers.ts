import * as admin from 'firebase-admin';
import { getProfile, sendReplyMessage } from './client';

/**
 * 友だち追加イベントを処理
 * @param event - LINEイベント
 */
export async function handleFollow(event: any): Promise<void> {
  const lineUserId = event.source.userId;
  const replyToken = event.replyToken;

  console.log(`New friend added: ${lineUserId}`);

  try {
    // LINEプロフィールを取得
    const profile = await getProfile(lineUserId);

    // 一時的に保存（連携待ち）
    await admin.firestore().collection('pendingLineUsers').doc(lineUserId).set({
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || null,
      addedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // あいさつメッセージを送信
    const welcomeMessage = `こんにちは、${profile.displayName}さん！🏃

Mayurin Running Trackerの公式アカウントを友だち追加いただき、ありがとうございます！

【次のステップ】
1. Mayurin Running Trackerアプリを開く
2. 「スケジュール」→「設定」タブ
3. 「LINE連携」セクションで「連携コードを生成」をタップ
4. 表示された8桁のコードをこのトークに送信

連携が完了すると、ランニングのリマインダーをお届けします💪`;

    await sendReplyMessage(replyToken, welcomeMessage);
  } catch (error) {
    console.error('Error handling follow event:', error);
  }
}

/**
 * ブロック/削除イベントを処理
 * @param event - LINEイベント
 */
export async function handleUnfollow(event: any): Promise<void> {
  const lineUserId = event.source.userId;

  console.log(`User unfollowed: ${lineUserId}`);

  try {
    const db = admin.firestore();

    // FirebaseユーザーとのマッピングをFirestoreから検索
    const usersSnapshot = await db.collection('users')
      .where('lineMessaging.lineUserId', '==', lineUserId)
      .limit(1)
      .get();

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      await userDoc.ref.update({
        lineMessaging: admin.firestore.FieldValue.delete(),
      });

      console.log(`Disconnected LINE for user: ${userDoc.id}`);
    }

    // マッピングテーブルからも削除
    await db.collection('lineUserMapping').doc(lineUserId).delete();

    // 保留中のユーザーからも削除
    await db.collection('pendingLineUsers').doc(lineUserId).delete();

  } catch (error) {
    console.error('Error handling unfollow event:', error);
  }
}

/**
 * メッセージイベントを処理
 * @param event - LINEイベント
 */
export async function handleMessage(event: any): Promise<void> {
  const lineUserId = event.source.userId;
  const replyToken = event.replyToken;
  const messageText = event.message.text;

  console.log(`Message from ${lineUserId}: ${messageText}`);

  try {
    // 連携コードの形式チェック（8桁の英数字）
    const codePattern = /^[A-Z0-9]{8}$/;
    if (!codePattern.test(messageText.trim())) {
      // 連携コード以外のメッセージ
      const helpMessage = `連携するには、アプリで生成した8桁の連携コードを送信してください。

例: AB12CD34

アプリで連携コードを生成できない場合は、以下を確認してください：
• アプリにログインしている
• 「スケジュール」→「設定」タブを開いている
• 「連携コードを生成」ボタンをタップ`;

      await sendReplyMessage(replyToken, helpMessage);
      return;
    }

    const code = messageText.trim().toUpperCase();

    // Firestoreから連携コードを検索
    const db = admin.firestore();
    const codeDoc = await db.collection('linkingCodes').doc(code).get();

    if (!codeDoc.exists) {
      await sendReplyMessage(replyToken, '❌ 連携コードが見つかりませんでした。\n\nアプリで新しいコードを生成してください。');
      return;
    }

    const codeData = codeDoc.data()!;

    // 有効期限チェック
    const expiresAt = codeData.expiresAt.toDate();
    if (new Date() > expiresAt) {
      await sendReplyMessage(replyToken, '⏰ 連携コードの有効期限が切れています。\n\nアプリで新しいコードを生成してください。');
      await codeDoc.ref.delete();
      return;
    }

    // 使用済みチェック
    if (codeData.used) {
      await sendReplyMessage(replyToken, '❌ この連携コードは既に使用されています。\n\nアプリで新しいコードを生成してください。');
      return;
    }

    // LINEプロフィールを取得
    const profile = await getProfile(lineUserId);

    // FirebaseユーザーとLINE User IDを紐付け
    const firebaseUserId = codeData.firebaseUserId;
    await db.collection('users').doc(firebaseUserId).set({
      lineMessaging: {
        lineUserId,
        isConnected: true,
        connectedAt: admin.firestore.FieldValue.serverTimestamp(),
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl || null,
      },
      notificationPreferences: {
        enabled: true,
        reminderMinutesBefore: 60,
        notifyOnScheduleCreated: true,
        notifyOnScheduleCompleted: false,
      },
    }, { merge: true });

    // マッピングテーブルに追加（逆引き用）
    await db.collection('lineUserMapping').doc(lineUserId).set({
      firebaseUserId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 連携コードを使用済みにマーク
    await codeDoc.ref.update({
      used: true,
      usedAt: admin.firestore.FieldValue.serverTimestamp(),
      linkedLineUserId: lineUserId,
    });

    // 保留中のユーザーから削除
    await db.collection('pendingLineUsers').doc(lineUserId).delete();

    // 成功メッセージを送信
    const successMessage = `✅ 連携が完了しました！

${profile.displayName}さんのアカウントとMayurin Running Trackerが連携されました。

これから、スケジュールしたランニングの1時間前にリマインダーをお届けします🏃‍♂️

【通知設定の変更】
アプリの「スケジュール」→「設定」タブで、通知のタイミングやON/OFFを変更できます。

それでは、良いランニングライフを！💪`;

    await sendReplyMessage(replyToken, successMessage);

    console.log(`Successfully linked Firebase user ${firebaseUserId} with LINE user ${lineUserId}`);

  } catch (error) {
    console.error('Error handling message event:', error);
    await sendReplyMessage(replyToken, '❌ エラーが発生しました。しばらくしてから再度お試しください。');
  }
}
