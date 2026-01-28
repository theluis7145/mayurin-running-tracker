import { formatTime, formatDistance, formatPace } from '../utils/format';
import { getRandomMessage } from '../data/encourageMessages';
import { useState, useEffect } from 'react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  duration: number;
  distance: number;
  pace: number;
  lapsCount: number;
}

export function CompletionModal({
  isOpen,
  onClose,
  duration,
  distance,
  pace,
  lapsCount,
}: CompletionModalProps) {
  const [message, setMessage] = useState(getRandomMessage());

  // モーダルが開くたびに新しいメッセージを取得
  useEffect(() => {
    if (isOpen) {
      setMessage(getRandomMessage());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // カテゴリーごとの背景色
  const getCategoryColor = () => {
    switch (message.category) {
      case 'beauty':
        return 'from-sunset-400 to-sunset-600';
      case 'achievement':
        return 'from-sun-400 to-sun-600';
      case 'support':
        return 'from-sky-400 to-sky-600';
      case 'health':
        return 'from-green-400 to-green-600';
      case 'humor':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-sky-400 to-sky-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in">
        {/* ヘッダー */}
        <div className={`bg-gradient-to-r ${getCategoryColor()} text-white p-6 text-center`}>
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold">完走おめでとう！</h2>
        </div>

        {/* メッセージ */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-sky-50 to-sun-50 rounded-lg p-4 mb-6">
            <p className="text-lg text-gray-800 text-center leading-relaxed">{message.text}</p>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-sky-700">{formatTime(duration)}</div>
              <div className="text-xs text-gray-500 mt-1">タイム</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-sky-700">{formatDistance(distance)}</div>
              <div className="text-xs text-gray-500 mt-1">距離</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-sky-700">{formatPace(pace)}</div>
              <div className="text-xs text-gray-500 mt-1">平均ペース</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-sky-700">{lapsCount}</div>
              <div className="text-xs text-gray-500 mt-1">ラップ数</div>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            記録を確認する
          </button>
        </div>
      </div>
    </div>
  );
}
