import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * 8桁のランダムな連携コードを生成
 * 形式: 大文字英数字（例: AB12CD34）
 */
function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 紛らわしい文字を除外
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * LINE連携コードを生成
 * ユーザーがLINEと連携するための8桁コードを生成
 */
export const generateLinkingCode = functions.https.onCall(
  async (data, context) => {
    // 認証チェック
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const userId = context.auth.uid;
    const db = admin.firestore();

    try {
      // 既存の未使用コードがあれば削除
      const existingCodesSnapshot = await db
        .collection('linkingCodes')
        .where('firebaseUserId', '==', userId)
        .where('used', '==', false)
        .get();

      const deletePromises = existingCodesSnapshot.docs.map((doc) =>
        doc.ref.delete()
      );
      await Promise.all(deletePromises);

      // 新しいコードを生成（重複しないまで試行）
      let code: string;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        code = generateRandomCode();
        const existingDoc = await db.collection('linkingCodes').doc(code).get();

        if (!existingDoc.exists) {
          break;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Failed to generate unique code');
        }
      } while (true);

      // 有効期限: 10分後
      const expiresAt = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 10 * 60 * 1000)
      );

      // Firestoreに保存
      await db.collection('linkingCodes').doc(code).set({
        firebaseUserId: userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt,
        used: false,
      });

      console.log(`Generated linking code ${code} for user ${userId}`);

      return {
        code,
        expiresAt: expiresAt.toDate().toISOString(),
      };
    } catch (error: any) {
      console.error('Error generating linking code:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to generate linking code',
        error.message
      );
    }
  }
);

/**
 * LINE連携を解除
 * FirebaseユーザーとLINE User IDの紐付けを削除
 */
export const disconnectLineMessaging = functions.https.onCall(
  async (data, context) => {
    // 認証チェック
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const userId = context.auth.uid;
    const db = admin.firestore();

    try {
      // ユーザーのLINE情報を取得
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found');
      }

      const userData = userDoc.data();
      const lineUserId = userData?.lineMessaging?.lineUserId;

      // LINE情報を削除
      await userDoc.ref.update({
        lineMessaging: admin.firestore.FieldValue.delete(),
      });

      // マッピングテーブルからも削除
      if (lineUserId) {
        await db.collection('lineUserMapping').doc(lineUserId).delete();
      }

      console.log(`Disconnected LINE messaging for user ${userId}`);

      return { success: true };
    } catch (error: any) {
      console.error('Error disconnecting LINE messaging:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to disconnect LINE messaging',
        error.message
      );
    }
  }
);

/**
 * 期限切れ連携コードのクリーンアップ（1日1回実行）
 */
export const cleanupExpiredLinkingCodes = functions.pubsub
  .schedule('0 3 * * *') // 毎日3:00 AM（JST）
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    try {
      // 期限切れのコードを取得
      const expiredCodesSnapshot = await db
        .collection('linkingCodes')
        .where('expiresAt', '<', now)
        .get();

      if (expiredCodesSnapshot.empty) {
        console.log('No expired linking codes to clean up');
        return;
      }

      // 削除処理
      const deletePromises = expiredCodesSnapshot.docs.map((doc) =>
        doc.ref.delete()
      );

      await Promise.all(deletePromises);

      console.log(`Cleaned up ${expiredCodesSnapshot.size} expired linking codes`);
    } catch (error) {
      console.error('Error cleaning up expired linking codes:', error);
    }
  });
