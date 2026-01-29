import { useState, useEffect } from 'react';
import {
  ScheduledRun,
  LineMessagingProfile,
  NotificationPreferences,
} from '../types';
import {
  saveScheduledRun,
  loadScheduledRuns,
  deleteScheduledRun,
  toggleScheduleActive,
  subscribeToScheduledRuns,
  subscribeToLineMessagingProfile,
  subscribeToNotificationPreferences,
  saveNotificationPreferences,
} from '../utils/firestore';

interface UseSchedulesReturn {
  schedules: ScheduledRun[];
  isLineConnected: boolean;
  lineMessagingProfile: LineMessagingProfile | null;
  notificationPreferences: NotificationPreferences | null;
  isLoading: boolean;
  error: string | null;
  createSchedule: (schedule: Partial<ScheduledRun>) => Promise<void>;
  updateSchedule: (id: string, schedule: Partial<ScheduledRun>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  updateNotificationPreferences: (preferences: NotificationPreferences) => Promise<void>;
  refreshData: () => Promise<void>;
}

/**
 * スケジュール管理とLINE Notify設定を扱うカスタムフック
 * @param userId - ユーザーID
 * @returns スケジュール管理の状態と操作関数
 */
export function useSchedules(userId: string | null): UseSchedulesReturn {
  const [schedules, setSchedules] = useState<ScheduledRun[]>([]);
  const [lineMessagingProfile, setLineMessagingProfile] = useState<LineMessagingProfile | null>(null);
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // LINE Messaging接続状態の導出
  const isLineConnected = lineMessagingProfile?.isConnected || false;

  // データの初期読み込み
  useEffect(() => {
    if (!userId) {
      setSchedules([]);
      setLineMessagingProfile(null);
      setNotificationPreferences(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // リアルタイム監視を設定
    const unsubscribeSchedules = subscribeToScheduledRuns(userId, (data) => {
      setSchedules(data);
      setIsLoading(false);
    });

    const unsubscribeLineMessaging = subscribeToLineMessagingProfile(userId, (data) => {
      setLineMessagingProfile(data);
    });

    const unsubscribePreferences = subscribeToNotificationPreferences(
      userId,
      (data) => {
        setNotificationPreferences(data);
      }
    );

    // クリーンアップ関数
    return () => {
      unsubscribeSchedules();
      unsubscribeLineMessaging();
      unsubscribePreferences();
    };
  }, [userId]);

  // スケジュール作成
  const createSchedule = async (
    schedule: Partial<ScheduledRun>
  ): Promise<void> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      const newSchedule: Partial<ScheduledRun> & { id: string } = {
        id: crypto.randomUUID(),
        userId,
        title: schedule.title || '',
        description: schedule.description,
        scheduledTime: schedule.scheduledTime || new Date().toISOString(),
        timezone: schedule.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        recurrence: schedule.recurrence || { type: 'none' },
        goal: schedule.goal,
        isActive: schedule.isActive !== undefined ? schedule.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveScheduledRun(userId, newSchedule);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create schedule';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // スケジュール更新
  const updateSchedule = async (
    id: string,
    schedule: Partial<ScheduledRun>
  ): Promise<void> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      const updatedSchedule: Partial<ScheduledRun> & { id: string } = {
        id,
        ...schedule,
        updatedAt: new Date().toISOString(),
      };

      await saveScheduledRun(userId, updatedSchedule);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update schedule';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // スケジュール削除
  const deleteSchedule = async (id: string): Promise<void> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      await deleteScheduledRun(userId, id);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete schedule';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // スケジュールのアクティブ状態を切り替え
  const toggleActive = async (id: string, isActive: boolean): Promise<void> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      await toggleScheduleActive(userId, id, isActive);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to toggle schedule';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // 通知設定の更新
  const updateNotificationPreferences = async (
    preferences: NotificationPreferences
  ): Promise<void> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      await saveNotificationPreferences(userId, preferences);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update notification preferences';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // データの再読み込み（エラー時のリトライ用）
  const refreshData = async (): Promise<void> => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await loadScheduledRuns(userId);
      setSchedules(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to refresh data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    schedules,
    isLineConnected,
    lineMessagingProfile,
    notificationPreferences,
    isLoading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toggleActive,
    updateNotificationPreferences,
    refreshData,
  };
}
