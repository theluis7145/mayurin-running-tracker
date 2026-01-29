import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { addMinutes, isAfter, isBefore, parseISO } from 'date-fns';

/**
 * タイムゾーンを考慮して現在時刻を取得
 * @param timezone - IANAタイムゾーン (例: "Asia/Tokyo")
 * @returns タイムゾーンに変換された現在時刻
 */
export function getCurrentTimeInTimezone(timezone: string): Date {
  return utcToZonedTime(new Date(), timezone);
}

/**
 * ISO 8601文字列をタイムゾーンを考慮してDateオブジェクトに変換
 * @param isoString - ISO 8601形式の日時文字列
 * @param timezone - IANAタイムゾーン
 * @returns Dateオブジェクト
 */
export function parseScheduledTime(
  isoString: string,
  timezone: string
): Date {
  const localTime = parseISO(isoString);
  return zonedTimeToUtc(localTime, timezone);
}

/**
 * スケジュールされた時刻がリマインダー送信ウィンドウ内かチェック
 * @param scheduledTime - スケジュールされた時刻（ISO 8601）
 * @param timezone - タイムゾーン
 * @param reminderMinutesBefore - リマインダーを送信する分数（スケジュールの何分前）
 * @param windowMinutes - チェックウィンドウの幅（分）。デフォルト: 10分
 * @returns リマインダーを送信すべき場合はtrue
 */
export function shouldSendReminder(
  scheduledTime: string,
  timezone: string,
  reminderMinutesBefore: number,
  lastNotifiedAt?: string,
  windowMinutes: number = 10
): boolean {
  try {
    const now = getCurrentTimeInTimezone(timezone);
    const scheduled = parseScheduledTime(scheduledTime, timezone);

    // リマインダー送信時刻を計算
    const reminderTime = addMinutes(scheduled, -reminderMinutesBefore);

    // ウィンドウの開始と終了
    const windowStart = addMinutes(reminderTime, -windowMinutes / 2);
    const windowEnd = addMinutes(reminderTime, windowMinutes / 2);

    // 現在時刻がウィンドウ内かチェック
    const isInWindow = isAfter(now, windowStart) && isBefore(now, windowEnd);

    // すでに通知済みかチェック
    if (lastNotifiedAt) {
      const lastNotified = parseISO(lastNotifiedAt);
      // 最後の通知がリマインダー時刻より後の場合は、すでに送信済み
      if (isAfter(lastNotified, reminderTime)) {
        return false;
      }
    }

    return isInWindow;
  } catch (error) {
    console.error('Error checking reminder time:', error);
    return false;
  }
}

/**
 * 指定された曜日が今日かチェック
 * @param daysOfWeek - 曜日の配列 (0=日曜, 6=土曜)
 * @param timezone - タイムゾーン
 * @returns 今日が指定された曜日に含まれる場合はtrue
 */
export function isScheduledForToday(
  daysOfWeek: number[] | undefined,
  timezone: string
): boolean {
  if (!daysOfWeek || daysOfWeek.length === 0) {
    return true; // 曜日指定がない場合は常にtrue
  }

  const now = getCurrentTimeInTimezone(timezone);
  const today = now.getDay(); // 0=日曜, 6=土曜

  return daysOfWeek.includes(today);
}
