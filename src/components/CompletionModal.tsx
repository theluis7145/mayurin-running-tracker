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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black bg-opacity-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className={`bg-gradient-to-r ${getCategoryColor()} text-white p-6 text-center`}>
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">完走おめでとう！</h2>
        </div>

        {/* メッセージ */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-sky-50 to-sun-50 rounded-lg p-4 mb-6 border border-gray-100">
            <p className="text-lg text-gray-800 text-center leading-relaxed">{message.text}</p>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="bg-white border-2 border-gray-100 rounded-lg p-4 sm:p-5 text-center transition-colors">
              <div className="text-2xl sm:text-3xl font-bold text-sky-700">{formatTime(duration)}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">タイム</div>
            </div>
            <div className="bg-white border-2 border-gray-100 rounded-lg p-4 sm:p-5 text-center transition-colors">
              <div className="text-2xl sm:text-3xl font-bold text-sky-700">{formatDistance(distance)}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">距離</div>
            </div>
            <div className="bg-white border-2 border-gray-100 rounded-lg p-4 sm:p-5 text-center transition-colors">
              <div className="text-2xl sm:text-3xl font-bold text-sky-700">{formatPace(pace)}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">平均ペース</div>
            </div>
            <div className="bg-white border-2 border-gray-100 rounded-lg p-4 sm:p-5 text-center transition-colors">
              <div className="text-2xl sm:text-3xl font-bold text-sky-700">{lapsCount}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">ラップ数</div>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="w-full py-4 sm:py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold text-lg rounded-lg shadow-md active:shadow-lg active:scale-[0.98] transition-all duration-150"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
