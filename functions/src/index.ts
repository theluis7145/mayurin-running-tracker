import * as admin from 'firebase-admin';

// Firebase Admin初期化
admin.initializeApp();

// LINE Messaging API関連の関数をエクスポート
export { lineWebhook } from './line-messaging/webhook';
export { generateLinkingCode, disconnectLineMessaging, cleanupExpiredLinkingCodes } from './line-messaging/linking';

// スケジュール関連の関数をエクスポート
export { checkScheduledRuns } from './scheduled-runs/scheduler';
