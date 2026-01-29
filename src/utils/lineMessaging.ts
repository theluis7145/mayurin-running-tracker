import { functions } from '../config/firebase';
import { httpsCallable } from 'firebase/functions';

/**
 * LINE連携コードを生成
 * ユーザーがLINEと連携するための8桁コードを生成
 */
export async function generateLinkingCode(): Promise<{
  code: string;
  expiresAt: string;
}> {
  const generateCode = httpsCallable(functions, 'generateLinkingCode');
  const result = await generateCode();
  return result.data as { code: string; expiresAt: string };
}

/**
 * LINE連携を解除
 * FirebaseユーザーとLINE User IDの紐付けを削除
 */
export async function disconnectLineMessaging(): Promise<void> {
  const disconnect = httpsCallable(functions, 'disconnectLineMessaging');
  await disconnect();
}
