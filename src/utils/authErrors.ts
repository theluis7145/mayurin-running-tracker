// Firebase認証エラーコードを日本語メッセージに変換
export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'このメールアドレスは既に登録されています',
    'auth/invalid-email': 'メールアドレスの形式が正しくありません',
    'auth/user-not-found': 'ユーザーが見つかりません',
    'auth/wrong-password': 'パスワードが間違っています',
    'auth/weak-password': 'パスワードは6文字以上で設定してください',
    'auth/network-request-failed': 'ネットワークエラーが発生しました',
    'auth/too-many-requests': 'リクエストが多すぎます。しばらくしてから再度お試しください',
    'auth/user-disabled': 'このアカウントは無効化されています',
    'auth/operation-not-allowed': 'この操作は許可されていません',
    'auth/invalid-credential': '認証情報が無効です',
  };

  return errorMessages[errorCode] || 'エラーが発生しました。もう一度お試しください';
};
