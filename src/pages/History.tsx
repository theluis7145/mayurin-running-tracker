import { useState, useEffect, useMemo } from 'react';
import { loadRunRecords, deleteRunRecord } from '../utils/storage';
import { RunRecord } from '../types';
import { HistoryCard } from '../components/HistoryCard';
import { formatDistance } from '../utils/format';

export function History() {
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

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

    if (filter === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (filter === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sun-50 pb-20">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-sky-800 mb-6">走行履歴</h1>

        {/* フィルター */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-sky-500 text-white'
                : 'bg-white text-gray-700 hover:bg-sky-50'
            }`}
          >
            全て
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'week'
                ? 'bg-sky-500 text-white'
                : 'bg-white text-gray-700 hover:bg-sky-50'
            }`}
          >
            過去7日
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'month'
                ? 'bg-sky-500 text-white'
                : 'bg-white text-gray-700 hover:bg-sky-50'
            }`}
          >
            過去30日
          </button>
        </div>

        {/* 統計サマリー */}
        {filteredRecords.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-sky-800 mb-4">
              統計（
              {filter === 'all' ? '全期間' : filter === 'week' ? '過去7日' : '過去30日'}）
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
            <div className="text-6xl mb-4">🏃</div>
            <p className="text-gray-600 text-lg mb-2">
              {filter === 'all'
                ? 'まだ記録がありません'
                : 'この期間の記録がありません'}
            </p>
            <p className="text-gray-500 text-sm">
              ランニングを開始して、記録を保存しましょう！
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
