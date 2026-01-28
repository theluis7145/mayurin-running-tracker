/**
 * 時間帯に応じた挨拶メッセージを取得
 */
export function getGreetingMessage(nickname: string): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return `おはようございます、${nickname}さん`;
  } else if (hour >= 12 && hour < 17) {
    return `こんにちは、${nickname}さん`;
  } else if (hour >= 17 && hour < 21) {
    return `こんばんは、${nickname}さん`;
  } else {
    return `お疲れ様です、${nickname}さん`;
  }
}

/**
 * 時間帯のインジケーターを取得
 */
export function getTimeIndicator(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
}

/**
 * 時間帯に応じた背景グラデーションを取得
 */
export function getTimeGradient(): string {
  const indicator = getTimeIndicator();

  switch (indicator) {
    case 'morning':
      return 'from-sky-400 to-sky-500';
    case 'afternoon':
      return 'from-sun-400 to-sun-500';
    case 'evening':
      return 'from-sunset-400 to-sunset-500';
    case 'night':
      return 'from-indigo-500 to-purple-600';
    default:
      return 'from-sky-400 to-sun-400';
  }
}
