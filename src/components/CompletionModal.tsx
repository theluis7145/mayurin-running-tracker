import { formatTimeSimple, formatDistance, formatSpeed } from '../utils/format';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black bg-opacity-90 animate-in fade-in duration-200">
      <div className="bg-gray-900 border-2 border-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="bg-black text-white p-8 text-center border-b border-gray-800">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
            <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">RUN COMPLETE</h2>
        </div>

        {/* メッセージ */}
        <div className="p-6">
          <div className="bg-gray-800 rounded-2xl p-5 mb-6 border border-gray-700">
            <p className="text-base text-gray-200 text-center leading-relaxed">{message.text}</p>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{formatTimeSimple(duration)}</div>
              <div className="text-[10px] text-gray-400 mt-2 font-bold tracking-wider">TIME</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{formatDistance(distance)}</div>
              <div className="text-[10px] text-gray-400 mt-2 font-bold tracking-wider">DISTANCE</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{formatSpeed(pace)} km/h</div>
              <div className="text-[10px] text-gray-400 mt-2 font-bold tracking-wider">AVG SPEED</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{lapsCount}</div>
              <div className="text-[10px] text-gray-400 mt-2 font-bold tracking-wider">LAPS</div>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-white text-black font-bold text-base rounded-full active:scale-95 transition-all duration-150 tracking-wide"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
