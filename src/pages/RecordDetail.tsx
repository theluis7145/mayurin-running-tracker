import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RunRecord } from '../types';
import { getRunRecordById, deleteRunRecord } from '../utils/storage';
import { formatDate, formatTimeOfDay, formatTime, formatDistance, formatSpeed } from '../utils/format';
import { Map } from '../components/Map';
import { LapList } from '../components/LapList';

export function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<RunRecord | null>(null);

  useEffect(() => {
    if (id) {
      const loaded = getRunRecordById(id);
      setRecord(loaded);
    }
  }, [id]);

  const handleDelete = () => {
    if (!record) return;

    if (window.confirm('この記録を削除してもよろしいですか？')) {
      deleteRunRecord(record.id);
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sun-50 safe-bottom">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-sky-400 to-sun-400 text-white p-6 shadow-md">
          <button
            onClick={handleBack}
            className="text-white hover:text-sky-100 mb-4 flex items-center gap-2"
          >
            ← 履歴に戻る
          </button>
          <h1 className="text-2xl font-bold">{formatDate(record.startTime)}</h1>
          <p className="text-sky-100 mt-1">{formatTimeOfDay(record.startTime)} 開始</p>
        </div>

        {/* 地図 */}
        {record.coordinates.length > 0 && (
          <div className="px-4 pt-6">
            <h2 className="text-lg font-semibold text-sky-800 mb-3">走行ルート</h2>
            <Map
              coordinates={record.coordinates}
              currentPosition={null}
              className="h-80 md:h-96"
            />
          </div>
        )}

        {/* 統計情報 */}
        <div className="px-4 pt-6">
          <h2 className="text-lg font-semibold text-sky-800 mb-3">記録サマリー</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-sky-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-sky-700">
                  {formatTime(record.duration)}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">総時間</div>
              </div>
              <div className="text-center p-4 bg-sun-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-sun-700">
                  {formatDistance(record.distance)}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">総距離</div>
              </div>
              <div className="text-center p-4 bg-sky-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-sky-700">
                  {formatSpeed(record.averagePace)} km/h
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">平均時速</div>
              </div>
              <div className="text-center p-4 bg-sun-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-sun-700">{record.laps.length}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">ラップ数</div>
              </div>
            </div>
          </div>
        </div>

        {/* ラップ詳細 */}
        {record.laps.length > 0 && (
          <div className="px-4 pt-6">
            <LapList laps={record.laps} />
          </div>
        )}

        {/* GPS情報 */}
        {record.coordinates.length > 0 && (
          <div className="px-4 pt-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">GPS情報</h3>
              <div className="text-sm text-gray-600">
                <p>記録点数: {record.coordinates.length}点</p>
                <p>
                  平均精度: ±
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
        <div className="px-4 pt-6 pb-6">
          <button
            onClick={handleDelete}
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200"
          >
            この記録を削除
          </button>
        </div>
      </div>
    </div>
  );
}
