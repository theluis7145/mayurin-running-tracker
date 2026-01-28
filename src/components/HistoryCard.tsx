import { RunRecord } from '../types';
import { formatDate, formatTimeOfDay, formatTime, formatDistance, formatPace } from '../utils/format';
import { Link } from 'react-router-dom';

interface HistoryCardProps {
  record: RunRecord;
  onDelete?: (id: string) => void;
}

export function HistoryCard({ record, onDelete }: HistoryCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('この記録を削除しますか？')) {
      onDelete?.(record.id);
    }
  };

  return (
    <Link
      to={`/history/${record.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-4">
        {/* 日付と時刻 */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-semibold text-gray-800">
              {formatDate(record.startTime)}
            </div>
            <div className="text-sm text-gray-500">
              {formatTimeOfDay(record.startTime)} 開始
            </div>
          </div>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
              title="削除"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xl font-bold text-sky-700">
              {formatTime(record.duration)}
            </div>
            <div className="text-xs text-gray-500">タイム</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-sky-700">
              {formatDistance(record.distance)}
            </div>
            <div className="text-xs text-gray-500">距離</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-sky-700">
              {formatPace(record.averagePace)}
            </div>
            <div className="text-xs text-gray-500">ペース</div>
          </div>
        </div>

        {/* ラップ数 */}
        {record.laps.length > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            ラップ: {record.laps.length}回
          </div>
        )}

        {/* 座標数（GPS記録の有無） */}
        {record.coordinates.length > 0 && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-green-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>GPS記録あり ({record.coordinates.length}点)</span>
          </div>
        )}
      </div>

      {/* 詳細を見るインジケーター */}
      <div className="bg-gradient-to-r from-sky-50 to-sun-50 px-4 py-2 text-center text-sm text-sky-700 font-medium">
        タップして詳細を見る →
      </div>
    </Link>
  );
}
