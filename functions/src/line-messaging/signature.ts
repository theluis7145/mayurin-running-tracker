import * as crypto from 'crypto';

/**
 * LINE Webhookの署名を検証
 * @param body - リクエストボディ（文字列）
 * @param signature - X-Line-Signatureヘッダーの値
 * @returns 署名が正しい場合true
 */
export function verifySignature(body: string, signature: string): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  if (!channelSecret) {
    console.error('LINE_CHANNEL_SECRET is not set');
    return false;
  }

  if (!signature) {
    console.error('Signature is missing');
    return false;
  }

  const hash = crypto
    .createHmac('sha256', channelSecret)
    .update(body)
    .digest('base64');

  return hash === signature;
}
