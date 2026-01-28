import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToRunRecords, deleteRunRecord } from '../utils/firestore';
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
  const { user } = useAuth();
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // Firestoreから記録をリアルタイム監視
  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = subscribeToRunRecords(user.uid, (firestoreRecords) => {
      setRecords(firestoreRecords);
    });

    return unsubscribe;
  }, [user]);

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
  const handleDelete = async (id: string) => {
    if (!user) return;

    // Firestoreから削除（リアルタイム同期で自動的にローカル状態も更新される）
    await deleteRunRecord(user.uid, id);
  };

  // 現在のフィルターの表示ラベルを取得
  const currentFilterLabel = filterOptions.find((opt) => opt.key === filter)?.displayLabel || '全期間';

  return (
    <div className="min-h-screen bg-black safe-bottom">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">HISTORY</h1>

        {/* フィルター（横スクロール対応） */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  filter === option.key
                    ? 'bg-white text-black'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 統計サマリー */}
        {filteredRecords.length > 0 && (
          <div className="bg-gray-900 rounded-3xl p-8 mb-8 border border-gray-800">
            <h2 className="text-sm font-bold text-gray-400 mb-6 tracking-wider">
              STATS ({currentFilterLabel})
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stats.totalRuns}</div>
                <div className="text-xs text-gray-400 font-semibold tracking-wide">TOTAL RUNS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {formatDistance(stats.totalDistance)}
                </div>
                <div className="text-xs text-gray-400 font-semibold tracking-wide">TOTAL DISTANCE</div>
              </div>
            </div>
          </div>
        )}

        {/* 記録一覧 */}
        {filteredRecords.length === 0 ? (
          <div className="bg-gray-900 rounded-3xl p-16 text-center border border-gray-800">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-14 h-14 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-white text-xl mb-3 font-bold">
              {filter === 'all'
                ? 'No Records Yet'
                : 'No Records in This Period'}
            </p>
            <p className="text-gray-400 text-sm">
              Start running and save your records
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
