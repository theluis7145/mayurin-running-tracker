import { useState, useEffect, useMemo } from 'react';
import { loadRunRecords, deleteRunRecord } from '../utils/storage';
import { RunRecord } from '../types';
import { HistoryCard } from '../components/HistoryCard';
import { formatDistance } from '../utils/format';

type FilterType = 'all' | 'week' | 'month' | '3months' | '6months' | 'year' | '2years';

interface FilterOption {
  key: FilterType;
  label: string;
  displayLabel: string;
}

const filterOptions: FilterOption[] = [
  { key: 'all', label: '全て', displayLabel: '全期間' },
  { key: 'week', label: '1週間', displayLabel: '過去7日' },
  { key: 'month', label: '1ヶ月', displayLabel: '過去30日' },
  { key: '3months', label: '3ヶ月', displayLabel: '過去3ヶ月' },
  { key: '6months', label: '6ヶ月', displayLabel: '過去6ヶ月' },
  { key: 'year', label: '1年', displayLabel: '過去1年' },
  { key: '2years', label: '2年', displayLabel: '過去2年' },
];

export function History() {
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // 記録を読み込み
  useEffect(() => {
    const loaded = loadRunRecords();
    // 新しい順にソート
    loaded.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    setRecords(loaded);
  }, []);

  // フィルタリング
  const filteredRecords = useMemo(() => {
    if (filter === 'all') return records;

    const now = new Date();
    const filterDate = new Date();

    switch (filter) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      case '2years':
        filterDate.setFullYear(now.getFullYear() - 2);
        break;
    }

    return records.filter((record) => new Date(record.startTime) >= filterDate);
  }, [records, filter]);

  // 統計計算
  const stats = useMemo(() => {
    const totalRuns = filteredRecords.length;
    const totalDistance = filteredRecords.reduce((sum, r) => sum + r.distance, 0);
    const totalDuration = filteredRecords.reduce((sum, r) => sum + r.duration, 0);
    const averagePace =
      totalDistance > 0 ? totalDuration / 1000 / 60 / totalDistance : 0;

    return {
      totalRuns,
      totalDistance,
      totalDuration,
      averagePace,
    };
  }, [filteredRecords]);

  // 削除ハンドラ
  const handleDelete = (id: string) => {
    deleteRunRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // 現在のフィルターの表示ラベルを取得
  const currentFilterLabel = filterOptions.find((opt) => opt.key === filter)?.displayLabel || '全期間';

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sun-50 safe-bottom">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-sky-800 mb-6">走行履歴</h1>

        {/* フィルター（横スクロール対応） */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  filter === option.key
                    ? 'bg-sky-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-sky-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 統計サマリー */}
        {filteredRecords.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-sky-800 mb-4">
              統計（{currentFilterLabel}）
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-700">{stats.totalRuns}</div>
                <div className="text-sm text-gray-500 mt-1">総走行回数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-700">
                  {formatDistance(stats.totalDistance)}
                </div>
                <div className="text-sm text-gray-500 mt-1">総走行距離</div>
              </div>
            </div>
          </div>
        )}

        {/* 記録一覧 */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sky-50 flex items-center justify-center">
              <svg className="w-12 h-12 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-2 font-medium">
              {filter === 'all'
                ? 'まだ記録がありません'
                : 'この期間の記録がありません'}
            </p>
            <p className="text-gray-500 text-sm">
              ランニングを開始して、記録を保存しましょう
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <HistoryCard key={record.id} record={record} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
