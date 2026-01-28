import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RunRecord } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { loadRunRecord, deleteRunRecord as deleteRunRecordFromFirestore } from '../utils/firestore';
import { formatDate, formatTimeOfDay, formatTime, formatDistance, formatSpeed } from '../utils/format';
import { Map } from '../components/Map';
import { LapList } from '../components/LapList';

export function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [record, setRecord] = useState<RunRecord | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (id && user) {
        const loaded = await loadRunRecord(user.uid, id);
        setRecord(loaded);
      }
    };

    fetchRecord();
  }, [id, user]);

  const handleDelete = async () => {
    if (!record || !user) return;

    if (window.confirm('この記録を削除してもよろしいですか？')) {
      await deleteRunRecordFromFirestore(user.uid, record.id);
      navigate('/history');
    }
  };

  const handleBack = () => {
    navigate('/history');
  };

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sun-50 safe-bottom">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium">記録が見つかりませんでした</p>
            <button
              onClick={handleBack}
              className="mt-6 px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              履歴に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black safe-bottom">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-black text-white px-6 py-8 border-b border-gray-900">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 font-semibold text-sm tracking-wide"
          >
            ← BACK TO HISTORY
          </button>
          <h1 className="text-3xl font-bold tracking-tight">{formatDate(record.startTime)}</h1>
          <p className="text-gray-400 mt-2 text-sm tracking-wide">{formatTimeOfDay(record.startTime)} START</p>
        </div>

        {/* 地図 */}
        {record.coordinates.length > 0 && (
          <div className="px-6 pt-8">
            <h2 className="text-sm font-bold text-gray-400 mb-4 tracking-wider">ROUTE</h2>
            <Map
              coordinates={record.coordinates}
              currentPosition={null}
              className="h-80 md:h-96"
            />
          </div>
        )}

        {/* 統計情報 */}
        <div className="px-6 pt-8">
          <h2 className="text-sm font-bold text-gray-400 mb-4 tracking-wider">SUMMARY</h2>
          <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-800 rounded-2xl">
                <div className="text-xl font-bold text-white">
                  {formatTime(record.duration)}
                </div>
                <div className="text-[10px] text-gray-400 mt-2 font-semibold tracking-wide">TIME</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-2xl">
                <div className="text-xl font-bold text-white">
                  {formatDistance(record.distance)}
                </div>
                <div className="text-[10px] text-gray-400 mt-2 font-semibold tracking-wide">DISTANCE</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-2xl">
                <div className="text-xl font-bold text-white">
                  {formatSpeed(record.averagePace)} km/h
                </div>
                <div className="text-[10px] text-gray-400 mt-2 font-semibold tracking-wide">AVG SPEED</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-2xl">
                <div className="text-xl font-bold text-white">{record.laps.length}</div>
                <div className="text-[10px] text-gray-400 mt-2 font-semibold tracking-wide">LAPS</div>
              </div>
            </div>
          </div>
        </div>

        {/* ラップ詳細 */}
        {record.laps.length > 0 && (
          <div className="px-6 pt-8">
            <LapList laps={record.laps} />
          </div>
        )}

        {/* GPS情報 */}
        {record.coordinates.length > 0 && (
          <div className="px-6 pt-8">
            <div className="bg-gray-900 rounded-3xl p-5 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">GPS DATA</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Points: {record.coordinates.length}</p>
                <p>
                  Avg Accuracy: ±
                  {Math.round(
                    record.coordinates.reduce((sum, c) => sum + c.accuracy, 0) /
                      record.coordinates.length
                  )}
                  m
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 削除ボタン */}
        <div className="px-6 pt-8 pb-8">
          <button
            onClick={handleDelete}
            className="w-full py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors duration-200 tracking-wide"
          >
            DELETE THIS RECORD
          </button>
        </div>
      </div>
    </div>
  );
}
