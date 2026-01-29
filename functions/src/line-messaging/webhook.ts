import * as functions from 'firebase-functions';
import { verifySignature } from './signature';
import { handleFollow, handleUnfollow, handleMessage } from './handlers';

/**
 * LINE Webhook エンドポイント
 * LINE Platformからのイベントを受信して処理
 */
export const lineWebhook = functions.https.onRequest(async (req, res) => {
  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // 署名検証
  const signature = req.headers['x-line-signature'] as string;
  const body = JSON.stringify(req.body);

  if (!verifySignature(body, signature)) {
    console.error('Invalid signature');
    res.status(401).send('Invalid signature');
    return;
  }

  const events = req.body.events || [];

  // 各イベントを処理
  const promises = events.map(async (event: any) => {
    try {
      switch (event.type) {
        case 'follow':
          // 友だち追加
          await handleFollow(event);
          break;

        case 'unfollow':
          // ブロック/削除
          await handleUnfollow(event);
          break;

        case 'message':
          // メッセージ受信
          if (event.message.type === 'text') {
            await handleMessage(event);
          }
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error processing event:`, error);
      // エラーが発生してもLINEには200を返す（再送を防ぐ）
    }
  });

  await Promise.all(promises);

  // LINEには必ず200を返す
  res.status(200).send('OK');
});
