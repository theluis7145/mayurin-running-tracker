import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  UserProfile,
  RunRecord,
  ScheduledRun,
  LineMessagingProfile,
  NotificationPreferences,
} from '../types';

// ユーザープロフィールの保存
export const saveUserProfile = async (userId: string, profile: UserProfile): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await setDoc(
    userRef,
    {
      nickname: profile.nickname,
      avatarBase64: profile.avatarBase64 || null,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

// ユーザープロフィールの読み込み
export const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  const data = userSnap.data();
  return {
    nickname: data.nickname || '',
    avatarBase64: data.avatarBase64 || undefined,
  };
};

// ユーザープロフィールのリアルタイム監視
export const subscribeToProfile = (
  userId: string,
  callback: (profile: UserProfile | null) => void
): (() => void) => {
  const userRef = doc(db, 'users', userId);

  const unsubscribe = onSnapshot(userRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }

    const data = docSnap.data();
    callback({
      nickname: data.nickname || '',
      avatarBase64: data.avatarBase64 || undefined,
    });
  });

  return unsubscribe;
};

// 走行記録の保存
export const saveRunRecord = async (userId: string, record: RunRecord): Promise<void> => {
  const recordRef = doc(db, 'users', userId, 'runRecords', record.id);
  await setDoc(recordRef, {
    startTime: Timestamp.fromDate(new Date(record.startTime)),
    endTime: Timestamp.fromDate(new Date(record.endTime)),
    duration: record.duration,
    distance: record.distance,
    averagePace: record.averagePace,
    laps: record.laps,
    coordinates: record.coordinates,
    createdAt: Timestamp.now(),
  });
};

// 走行記録の読み込み
export const loadRunRecords = async (
  userId: string,
  limitCount?: number
): Promise<RunRecord[]> => {
  const recordsRef = collection(db, 'users', userId, 'runRecords');
  let q = query(recordsRef, orderBy('startTime', 'desc'));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      startTime: data.startTime.toDate().toISOString(),
      endTime: data.endTime.toDate().toISOString(),
      duration: data.duration,
      distance: data.distance,
      averagePace: data.averagePace,
      laps: data.laps,
      coordinates: data.coordinates,
    };
  });
};

// 走行記録のリアルタイム監視
export const subscribeToRunRecords = (
  userId: string,
  callback: (records: RunRecord[]) => void,
  limitCount?: number
): (() => void) => {
  const recordsRef = collection(db, 'users', userId, 'runRecords');
  let q = query(recordsRef, orderBy('startTime', 'desc'));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const records = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        startTime: data.startTime.toDate().toISOString(),
        endTime: data.endTime.toDate().toISOString(),
        duration: data.duration,
        distance: data.distance,
        averagePace: data.averagePace,
        laps: data.laps,
        coordinates: data.coordinates,
      };
    });
    callback(records);
  });

  return unsubscribe;
};

// 特定の走行記録の読み込み
export const loadRunRecord = async (userId: string, recordId: string): Promise<RunRecord | null> => {
  const recordRef = doc(db, 'users', userId, 'runRecords', recordId);
  const recordSnap = await getDoc(recordRef);

  if (!recordSnap.exists()) {
    return null;
  }

  const data = recordSnap.data();
  return {
    id: recordSnap.id,
    startTime: data.startTime.toDate().toISOString(),
    endTime: data.endTime.toDate().toISOString(),
    duration: data.duration,
    distance: data.distance,
    averagePace: data.averagePace,
    laps: data.laps,
    coordinates: data.coordinates,
  };
};

// 走行記録の削除
export const deleteRunRecord = async (userId: string, recordId: string): Promise<void> => {
  const recordRef = doc(db, 'users', userId, 'runRecords', recordId);
  await deleteDoc(recordRef);
};

// ==================== スケジュール管理 ====================

// スケジュールの保存（作成・更新）
export const saveScheduledRun = async (
  userId: string,
  schedule: Partial<ScheduledRun> & { id: string }
): Promise<void> => {
  const scheduleRef = doc(db, 'users', userId, 'scheduledRuns', schedule.id);
  const now = Timestamp.now();

  const data: any = {
    ...schedule,
    userId,
    scheduledTime: Timestamp.fromDate(new Date(schedule.scheduledTime!)),
    updatedAt: now,
  };

  // 新規作成時のみcreatedAtを設定
  const existingDoc = await getDoc(scheduleRef);
  if (!existingDoc.exists()) {
    data.createdAt = now;
  }

  await setDoc(scheduleRef, data, { merge: true });
};

// スケジュールの読み込み（全件）
export const loadScheduledRuns = async (userId: string): Promise<ScheduledRun[]> => {
  const schedulesRef = collection(db, 'users', userId, 'scheduledRuns');
  const q = query(schedulesRef, orderBy('scheduledTime', 'asc'));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      description: data.description,
      scheduledTime: data.scheduledTime.toDate().toISOString(),
      timezone: data.timezone,
      recurrence: data.recurrence,
      goal: data.goal,
      isActive: data.isActive,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
      lastNotifiedAt: data.lastNotifiedAt?.toDate().toISOString(),
      completedAt: data.completedAt?.toDate().toISOString(),
    };
  });
};

// スケジュールのリアルタイム監視
export const subscribeToScheduledRuns = (
  userId: string,
  callback: (schedules: ScheduledRun[]) => void
): (() => void) => {
  const schedulesRef = collection(db, 'users', userId, 'scheduledRuns');
  const q = query(schedulesRef, orderBy('scheduledTime', 'asc'));

  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const schedules = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        scheduledTime: data.scheduledTime.toDate().toISOString(),
        timezone: data.timezone,
        recurrence: data.recurrence,
        goal: data.goal,
        isActive: data.isActive,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
        lastNotifiedAt: data.lastNotifiedAt?.toDate().toISOString(),
        completedAt: data.completedAt?.toDate().toISOString(),
      };
    });
    callback(schedules);
  });

  return unsubscribe;
};

// スケジュールの削除
export const deleteScheduledRun = async (userId: string, scheduleId: string): Promise<void> => {
  const scheduleRef = doc(db, 'users', userId, 'scheduledRuns', scheduleId);
  await deleteDoc(scheduleRef);
};

// スケジュールのアクティブ状態を切り替え
export const toggleScheduleActive = async (
  userId: string,
  scheduleId: string,
  isActive: boolean
): Promise<void> => {
  const scheduleRef = doc(db, 'users', userId, 'scheduledRuns', scheduleId);
  await updateDoc(scheduleRef, {
    isActive,
    updatedAt: Timestamp.now(),
  });
};

// ==================== LINE Messaging ====================

// LINE Messagingプロフィールの読み込み
export const loadLineMessagingProfile = async (
  userId: string
): Promise<LineMessagingProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  const data = userSnap.data();
  const lineMessaging = data.lineMessaging;

  if (!lineMessaging) {
    return null;
  }

  return {
    lineUserId: lineMessaging.lineUserId || '',
    isConnected: lineMessaging.isConnected || false,
    connectedAt: lineMessaging.connectedAt?.toDate().toISOString() || '',
    displayName: lineMessaging.displayName,
    pictureUrl: lineMessaging.pictureUrl,
    lastNotificationSent: lineMessaging.lastNotificationSent?.toDate().toISOString(),
  };
};

// LINE Messaging接続状態の監視
export const subscribeToLineMessagingProfile = (
  userId: string,
  callback: (profile: LineMessagingProfile | null) => void
): (() => void) => {
  const userRef = doc(db, 'users', userId);

  const unsubscribe = onSnapshot(userRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }

    const data = docSnap.data();
    const lineMessaging = data.lineMessaging;

    if (!lineMessaging) {
      callback(null);
      return;
    }

    callback({
      lineUserId: lineMessaging.lineUserId || '',
      isConnected: lineMessaging.isConnected || false,
      connectedAt: lineMessaging.connectedAt?.toDate().toISOString() || '',
      displayName: lineMessaging.displayName,
      pictureUrl: lineMessaging.pictureUrl,
      lastNotificationSent: lineMessaging.lastNotificationSent?.toDate().toISOString(),
    });
  });

  return unsubscribe;
};

// ==================== 通知設定 ====================

// 通知設定の保存
export const saveNotificationPreferences = async (
  userId: string,
  preferences: NotificationPreferences
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    notificationPreferences: preferences,
  });
};

// 通知設定の読み込み
export const loadNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferences | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  const data = userSnap.data();
  return data.notificationPreferences || null;
};

// 通知設定のリアルタイム監視
export const subscribeToNotificationPreferences = (
  userId: string,
  callback: (preferences: NotificationPreferences | null) => void
): (() => void) => {
  const userRef = doc(db, 'users', userId);

  const unsubscribe = onSnapshot(userRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }

    const data = docSnap.data();
    callback(data.notificationPreferences || null);
  });

  return unsubscribe;
};
