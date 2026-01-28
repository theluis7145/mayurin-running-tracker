import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile, RunRecord } from '../types';

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
