import * as admin from 'firebase-admin';
import { sendPushMessage } from '../line-messaging/client';
import { shouldSendReminder, isScheduledForToday } from './timezone';

/**
 * スケジュールされたランのリマインダーメッセージを生成
 * @param schedule - スケジュールデータ
 * @param reminderMinutes - リマインダー送信時刻（分）
 * @returns リマインダーメッセージ
 */
function generateReminderMessage(
  schedule: any,
  reminderMinutes: number
): string {
  const lines = [];

  lines.push(`🏃 ランニングのリマインダー`);
  lines.push('');
  lines.push(`【${schedule.title}】`);

  if (schedule.description) {
    lines.push(schedule.description);
  }

  lines.push('');
  lines.push(`⏰ ${reminderMinutes}分後にスタート予定です！`);

  if (schedule.goal) {
    lines.push('');
    lines.push('【目標】');

    if (schedule.goal.targetDistance) {
      lines.push(`📏 距離: ${schedule.goal.targetDistance}km`);
    }

    if (schedule.goal.targetPace) {
      lines.push(`⚡ ペース: ${schedule.goal.targetPace}分/km`);
    }

    if (schedule.goal.targetDuration) {
      const minutes = Math.floor(schedule.goal.targetDuration / 60000);
      lines.push(`⏱️ 時間: ${minutes}分`);
    }
  }

  lines.push('');
  lines.push('準備を始めましょう！💪');

  return lines.join('\n');
}

/**
 * 個別のスケジュールに対してリマインダーを送信すべきかチェックし、送信
 * @param userId - Firebase User ID
 * @param scheduleId - スケジュールID
 * @param schedule - スケジュールデータ
 * @param lineUserId - LINE User ID
 * @param reminderMinutes - リマインダー送信時刻（分）
 * @returns 送信した場合はtrue
 */
export async function processScheduleReminder(
  userId: string,
  scheduleId: string,
  schedule: any,
  lineUserId: string,
  reminderMinutes: number
): Promise<boolean> {
  try {
    // 繰り返しパターンをチェック
    if (schedule.recurrence?.type === 'weekly') {
      // 曜日チェック
      if (!isScheduledForToday(schedule.recurrence.daysOfWeek, schedule.timezone)) {
        return false;
      }
    }

    // リマインダーを送信すべき時間かチェック
    const shouldSend = shouldSendReminder(
      schedule.scheduledTime,
      schedule.timezone,
      reminderMinutes,
      schedule.lastNotifiedAt
    );

    if (!shouldSend) {
      return false;
    }

    // メッセージ生成
    const message = generateReminderMessage(schedule, reminderMinutes);

    // LINE Push メッセージ送信
    const success = await sendPushMessage(lineUserId, message);

    if (success) {
      // 送信成功したら、lastNotifiedAtを更新
      await admin
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('scheduledRuns')
        .doc(scheduleId)
        .update({
          lastNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      // ユーザードキュメントのlastNotificationSentも更新
      await admin
        .firestore()
        .collection('users')
        .doc(userId)
        .update({
          'lineMessaging.lastNotificationSent': admin.firestore.FieldValue.serverTimestamp(),
        });

      console.log(`Reminder sent for schedule ${scheduleId} to user ${userId}`);
      return true;
    } else {
      console.error(`Failed to send reminder for schedule ${scheduleId}`);
      return false;
    }
  } catch (error) {
    console.error(`Error processing reminder for schedule ${scheduleId}:`, error);
    return false;
  }
}

/**
 * ユーザーのすべてのアクティブなスケジュールをチェックしてリマインダーを送信
 * @param userId - Firebase User ID
 * @param userData - ユーザーデータ
 * @returns 送信したリマインダーの数
 */
export async function processUserReminders(
  userId: string,
  userData: any
): Promise<number> {
  try {
    const lineUserId = userData.lineMessaging?.lineUserId;
    const reminderMinutes = userData.notificationPreferences?.reminderMinutesBefore || 60;

    if (!lineUserId) {
      console.log(`User ${userId} has no LINE connection`);
      return 0;
    }

    // アクティブなスケジュールを取得
    const scheduledRunsSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('scheduledRuns')
      .where('isActive', '==', true)
      .get();

    let sentCount = 0;

    for (const scheduleDoc of scheduledRunsSnapshot.docs) {
      const schedule = scheduleDoc.data();
      const scheduleId = scheduleDoc.id;

      const sent = await processScheduleReminder(
        userId,
        scheduleId,
        schedule,
        lineUserId,
        reminderMinutes
      );

      if (sent) {
        sentCount++;
      }
    }

    return sentCount;
  } catch (error) {
    console.error(`Error processing reminders for user ${userId}:`, error);
    return 0;
  }
}
