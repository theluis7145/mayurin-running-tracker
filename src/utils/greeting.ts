/**
 * 時間帯に応じた挨拶メッセージを取得
 */
export function getGreetingMessage(nickname: string): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return `おはよう、${nickname}さん!`;
  } else if (hour >= 12 && hour < 17) {
    return `こんにちは、${nickname}さん!`;
  } else if (hour >= 17 && hour < 21) {
    return `こんばんは、${nickname}さん!`;
  } else {
    return `お疲れ様、${nickname}さん!`;
  }
}

/**
 * 時間帯の絵文字を取得
 */
export function getTimeEmoji(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return '🌅';
  } else if (hour >= 12 && hour < 17) {
    return '☀️';
  } else if (hour >= 17 && hour < 21) {
    return '🌆';
  } else {
    return '🌙';
  }
}
