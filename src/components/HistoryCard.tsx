import { RunRecord } from '../types';
import { formatDate, formatTimeOfDay, formatTime, formatDistance, formatSpeed } from '../utils/format';
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
      className="block bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-200"
    >
      <div className="p-6">
        {/* 日付と時刻 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xl font-bold text-white">
              {formatDate(record.startTime)}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {formatTimeOfDay(record.startTime)} START
            </div>
          </div>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-400 hover:bg-red-900 hover:bg-opacity-20 p-2 rounded-full transition-colors"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-white">
              {formatTime(record.duration)}
            </div>
            <div className="text-[10px] text-gray-400 mt-1 font-semibold tracking-wide">TIME</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">
              {formatDistance(record.distance)}
            </div>
            <div className="text-[10px] text-gray-400 mt-1 font-semibold tracking-wide">DISTANCE</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">
              {formatSpeed(record.averagePace)} km/h
            </div>
            <div className="text-[10px] text-gray-400 mt-1 font-semibold tracking-wide">SPEED</div>
          </div>
        </div>

        {/* ラップ数とGPS */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {record.laps.length > 0 && (
            <div className="font-semibold">
              LAPS: {record.laps.length}
            </div>
          )}
          {record.coordinates.length > 0 && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>GPS ({record.coordinates.length})</span>
            </div>
          )}
        </div>
      </div>

      {/* 詳細を見るインジケーター */}
      <div className="bg-gray-800 px-4 py-3 text-center text-xs text-gray-400 font-bold tracking-wider border-t border-gray-700">
        VIEW DETAILS →
      </div>
    </Link>
  );
}
