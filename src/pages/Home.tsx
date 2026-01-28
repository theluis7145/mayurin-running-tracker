import { useEffect, useMemo, useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateTotalDistance, calculatePace } from '../utils/distance';
import { saveRunRecord } from '../utils/storage';
import { formatDistance } from '../utils/format';
import { RunRecord } from '../types';
import { Timer } from '../components/Timer';
import { ControlButtons } from '../components/ControlButtons';
import { LapList } from '../components/LapList';
import { CompletionModal } from '../components/CompletionModal';

interface CompletionData {
  duration: number;
  distance: number;
  pace: number;
  lapsCount: number;
}

export function Home() {
  const { elapsedTime, status, laps, start, pause, reset, recordLap } = useTimer();
  const {
    coordinates,
    isTracking,
    error: gpsError,
    startTracking,
    stopTracking,
    reset: resetGPS,
  } = useGeolocation({
    enableHighAccuracy: true,
    minAccuracy: 50, // 50m以上の誤差は除外
  });

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [completionData, setCompletionData] = useState<CompletionData>({
    duration: 0,
    distance: 0,
    pace: 0,
    lapsCount: 0,
  });

  // 距離とペースを計算
  const distance = useMemo(() => calculateTotalDistance(coordinates), [coordinates]);
  const pace = useMemo(() => calculatePace(distance, elapsedTime), [distance, elapsedTime]);

  // タイマー開始時にGPS追跡も開始
  useEffect(() => {
    if (status === 'running' && !isTracking) {
      startTracking();
      // 開始時刻を記録
      if (!startTime) {
        setStartTime(new Date().toISOString());
      }
    } else if (status === 'paused' && isTracking) {
      stopTracking();
    }
  }, [status, isTracking, startTracking, stopTracking, startTime]);

  // タイマーのスタートをラップ
  const handleStart = () => {
    start();
    if (!isTracking) {
      startTracking();
    }
    // 開始時刻を記録
    if (!startTime) {
      setStartTime(new Date().toISOString());
    }
  };

  // タイマーのリセット（記録を保存）
  const handleReset = () => {
    // 記録を保存（走行時間が5秒以上の場合のみ）
    if (elapsedTime >= 5000 && startTime) {
      const endTime = new Date().toISOString();
      const record: RunRecord = {
        id: crypto.randomUUID(),
        startTime,
        endTime,
        duration: elapsedTime,
        distance,
        averagePace: pace,
        laps,
        coordinates,
      };

      // 完了時のデータを保存（リセット前に）
      setCompletionData({
        duration: elapsedTime,
        distance,
        pace,
        lapsCount: laps.length,
      });

      saveRunRecord(record);
      setShowCompletionModal(true);
    }

    // リセット
    reset();
    resetGPS();
    setStartTime(null);
  };

  // 完了モーダルを閉じる
  const handleCloseModal = () => {
    setShowCompletionModal(false);
  };

  return (
    <div className="min-h-screen bg-black safe-bottom">
      <div className="max-w-4xl mx-auto px-6">
        {/* GPS エラー表示 */}
        {gpsError && (
          <div className="mt-8 p-4 bg-red-900 bg-opacity-20 border border-red-500 rounded-3xl text-red-400 text-sm">
            <span className="font-bold">警告:</span> {gpsError}
          </div>
        )}

        {/* タイマー表示 */}
        <Timer elapsedTime={elapsedTime} />

        {/* 統計表示 */}
        {status !== 'idle' && (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="text-sm sm:text-base text-gray-400 font-semibold tracking-wide mb-2">DISTANCE</div>
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                {formatDistance(distance)}
              </div>
            </div>
          </div>
        )}

        {/* コントロールボタン */}
        <ControlButtons
          status={status}
          onStart={handleStart}
          onPause={pause}
          onReset={handleReset}
          onLap={() => recordLap(distance, pace)}
        />

        {/* ラップ一覧 */}
        <LapList laps={laps} />

        {/* GPS使用の説明（初回のみ） */}
        {status === 'idle' && (
          <div className="mt-12 p-8 bg-gray-900 rounded-3xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight">
              HOW TO USE
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-white font-bold bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                <span>Press START to begin GPS tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white font-bold bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                <span>Distance is automatically calculated</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white font-bold bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                <span>Record lap times with LAP button</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white font-bold bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">4</span>
                <span>Pause, then FINISH to save your run</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white font-bold bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">5</span>
                <span>View route map in History</span>
              </li>
            </ul>
          </div>
        )}

        {/* 完了モーダル */}
        <CompletionModal
          isOpen={showCompletionModal}
          onClose={handleCloseModal}
          duration={completionData.duration}
          distance={completionData.distance}
          pace={completionData.pace}
          lapsCount={completionData.lapsCount}
        />
      </div>
    </div>
  );
}
