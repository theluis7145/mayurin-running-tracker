import { UserProfile, RunRecord } from '../types';

const PROFILE_KEY = 'mayurin_user_profile';
const RECORDS_KEY = 'mayurin_run_records';

/**
 * プロフィールを保存
 */
export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

/**
 * プロフィールを読み込み
 */
export function loadProfile(): UserProfile | null {
  const data = localStorage.getItem(PROFILE_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data) as UserProfile;
  } catch {
    return null;
  }
}

/**
 * ランニング記録を保存
 */
export function saveRunRecord(record: RunRecord): void {
  const records = loadRunRecords();
  records.push(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

/**
 * すべてのランニング記録を読み込み
 */
export function loadRunRecords(): RunRecord[] {
  const data = localStorage.getItem(RECORDS_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data) as RunRecord[];
  } catch {
    return [];
  }
}

/**
 * IDで記録を取得
 */
export function getRunRecordById(id: string): RunRecord | null {
  const records = loadRunRecords();
  return records.find(r => r.id === id) || null;
}

/**
 * 記録を削除
 */
export function deleteRunRecord(id: string): void {
  const records = loadRunRecords();
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(filtered));
}
