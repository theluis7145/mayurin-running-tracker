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
