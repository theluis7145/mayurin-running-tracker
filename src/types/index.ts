// ユーザープロフィール
export interface UserProfile {
  nickname: string;
  avatarBase64?: string; // Base64エンコードされた画像
}

// 座標
export interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp: string; // ISO 8601形式
  accuracy: number; // メートル単位
}

// ラップ記録
export interface Lap {
  lapNumber: number;
  elapsedTime: number; // ミリ秒
  splitTime: number; // ミリ秒（区間タイム）
  distance: number; // km
  pace: number; // 分/km
}

// ランニング記録
export interface RunRecord {
  id: string; // UUID
  startTime: string; // ISO 8601形式
  endTime: string; // ISO 8601形式
  duration: number; // ミリ秒
  distance: number; // km
  averagePace: number; // 分/km
  laps: Lap[];
  coordinates: Coordinate[];
  linkedScheduleId?: string; // 紐付けされたスケジュールID
}

// タイマーの状態
export type TimerStatus = 'idle' | 'running' | 'paused';

// 認証ユーザー情報
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// 認証エラー
export interface AuthError {
  code: string;
  message: string;
}

// LINE Messaging プロフィール
export interface LineMessagingProfile {
  lineUserId: string; // LINE User ID
  isConnected: boolean;
  connectedAt: string;
  displayName?: string; // LINEの表示名
  pictureUrl?: string; // LINEのプロフィール画像URL
  lastNotificationSent?: string;
}

// 連携コード
export interface LinkingCode {
  code: string; // 8桁のコード
  firebaseUserId: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

// 通知設定
export interface NotificationPreferences {
  enabled: boolean;
  reminderMinutesBefore: number; // 30, 60, 120など
  notifyOnScheduleCreated: boolean;
  notifyOnScheduleCompleted: boolean;
}

// 繰り返しパターン
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'custom';

export interface RecurrencePattern {
  type: RecurrenceType;
  daysOfWeek?: number[]; // 0=日曜, 6=土曜
  interval?: number; // 毎N日
}

// 目標設定
export interface RunGoal {
  targetDistance?: number; // km
  targetPace?: number; // 分/km
  targetDuration?: number; // ミリ秒
}

// スケジュール済みラン
export interface ScheduledRun {
  id: string;
  userId: string;
  title: string;
  description?: string;
  scheduledTime: string; // ISO 8601
  timezone: string; // IANA timezone (例: "Asia/Tokyo")
  recurrence: RecurrencePattern;
  goal?: RunGoal;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastNotifiedAt?: string;
  completedAt?: string;
}
