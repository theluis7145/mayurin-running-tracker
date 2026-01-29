import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { processUserReminders } from './reminders';

/**
 * スケジュールされたランをチェックしてリマインダーを送信するCron Function
 * 10分ごとに実行される
 */
export const checkScheduledRuns = functions.pubsub
  .schedule('every 10 minutes')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    console.log('Starting scheduled runs check...');

    try {
      const db = admin.firestore();

      // LINE Messagingが接続されていて、通知が有効なユーザーを取得
      const usersSnapshot = await db
        .collection('users')
        .where('lineMessaging.isConnected', '==', true)
        .where('notificationPreferences.enabled', '==', true)
        .get();

      console.log(`Found ${usersSnapshot.size} users with LINE Notify enabled`);

      let totalSent = 0;
      const processedUsers = [];

      // 各ユーザーのスケジュールをチェック
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();

        console.log(`Processing reminders for user: ${userId}`);

        const sentCount = await processUserReminders(userId, userData);
        totalSent += sentCount;

        if (sentCount > 0) {
          processedUsers.push({ userId, sentCount });
        }
      }

      console.log(`Scheduled runs check completed. Total reminders sent: ${totalSent}`);

      if (processedUsers.length > 0) {
        console.log('Reminders sent to users:', processedUsers);
      }

      return {
        success: true,
        usersChecked: usersSnapshot.size,
        remindersSent: totalSent,
        processedUsers,
      };
    } catch (error) {
      console.error('Error in checkScheduledRuns:', error);
      throw error;
    }
  });
