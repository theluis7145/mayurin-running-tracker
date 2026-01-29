import axios from 'axios';

const LINE_API_BASE = 'https://api.line.me/v2/bot';

/**
 * LINE Channel Access Tokenを取得
 */
function getChannelAccessToken(): string {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    throw new Error('LINE_CHANNEL_ACCESS_TOKEN is not set');
  }
  return token;
}

/**
 * LINEユーザーのプロフィールを取得
 * @param lineUserId - LINE User ID
 */
export async function getProfile(lineUserId: string): Promise<{
  displayName: string;
  userId: string;
  pictureUrl?: string;
  statusMessage?: string;
}> {
  const token = getChannelAccessToken();

  const response = await axios.get(
    `${LINE_API_BASE}/profile/${lineUserId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

/**
 * LINEユーザーにPushメッセージを送信
 * @param lineUserId - LINE User ID
 * @param message - 送信するメッセージ
 */
export async function sendPushMessage(
  lineUserId: string,
  message: string
): Promise<boolean> {
  try {
    const token = getChannelAccessToken();

    await axios.post(
      `${LINE_API_BASE}/message/push`,
      {
        to: lineUserId,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (error: any) {
    console.error('LINE Push message error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * LINEユーザーに返信メッセージを送信
 * @param replyToken - Reply Token
 * @param message - 送信するメッセージ
 */
export async function sendReplyMessage(
  replyToken: string,
  message: string
): Promise<boolean> {
  try {
    const token = getChannelAccessToken();

    await axios.post(
      `${LINE_API_BASE}/message/reply`,
      {
        replyToken,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (error: any) {
    console.error('LINE Reply message error:', error.response?.data || error.message);
    return false;
  }
}
