import { useState, useEffect } from 'react';
import { LineMessagingProfile } from '../types';
import { generateLinkingCode, disconnectLineMessaging } from '../utils/lineMessaging';

interface LineMessagingConnectProps {
  profile: LineMessagingProfile | null;
  isConnected: boolean;
}

export default function LineMessagingConnect({
  profile,
  isConnected,
}: LineMessagingConnectProps) {
  const [linkingCode, setLinkingCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // カウントダウンタイマー
  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('期限切れ');
        setLinkingCode(null);
        clearInterval(timer);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const handleGenerateCode = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const result = await generateLinkingCode();
      setLinkingCode(result.code);
      setExpiresAt(new Date(result.expiresAt));
    } catch (err: any) {
      setError(err.message || '連携コードの生成に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('LINE連携を解除しますか？\n通知が届かなくなります。')) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      await disconnectLineMessaging();
    } catch (err: any) {
      setError(err.message || 'LINE連携の解除に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">LINE連携</h3>
          <p className="text-sm text-gray-600 mt-1">
            リマインダー通知をLINEで受け取る
          </p>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!isConnected ? (
        <div className="space-y-4">
          {/* ステップ1: 友だち追加 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-2">
                  LINE公式アカウントを友だち追加
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  まず、Mayurin Running TrackerのLINE公式アカウントを友だち追加してください
                </p>
                <a
                  href="https://line.me/R/ti/p/@YOUR_LINE_ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[#00B900] hover:bg-[#00A000] text-white font-medium rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  友だち追加
                </a>
              </div>
            </div>
          </div>

          {/* ステップ2: 連携コード */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-2">連携コード送信</p>
                <p className="text-sm text-gray-600 mb-3">
                  友だち追加後、連携コードを生成してLINEトークに送信
                </p>

                {!linkingCode ? (
                  <button
                    onClick={handleGenerateCode}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
                  >
                    {isProcessing ? '生成中...' : '連携コードを生成'}
                  </button>
                ) : (
                  <div>
                    <div className="mb-3 p-4 bg-white border-2 border-blue-500 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">連携コード</p>
                        <p className="text-3xl font-mono font-bold text-blue-600 tracking-wider">
                          {linkingCode}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          有効期限: 残り {timeLeft}
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        このコードをLINEトークに送信してください
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>ヒント:</strong> 友だち追加すると、LINEで詳しい手順が届きます
            </p>
          </div>
        </div>
      ) : (
        // 連携済みの表示
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-medium text-green-800">
                LINEと連携済み
              </span>
            </div>
            {profile?.displayName && (
              <p className="text-sm text-green-700 mt-2">
                連携アカウント: {profile.displayName}
              </p>
            )}
            <p className="text-xs text-green-600 mt-1">
              接続日時: {new Date(profile?.connectedAt || '').toLocaleString('ja-JP')}
            </p>
            {profile?.lastNotificationSent && (
              <p className="text-xs text-green-600 mt-1">
                最終通知: {new Date(profile.lastNotificationSent).toLocaleString('ja-JP')}
              </p>
            )}
          </div>

          <button
            onClick={handleDisconnect}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
          >
            {isProcessing ? '処理中...' : '連携を解除'}
          </button>
        </div>
      )}
    </div>
  );
}
