import { useEffect, useMemo, useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateTotalDistance, calculatePace } from '../utils/distance';
import { saveRunRecord } from '../utils/storage';
import { RunRecord } from '../types';
import { Timer } from '../components/Timer';
import { StatsDisplay } from '../components/StatsDisplay';
import { ControlButtons } from '../components/ControlButtons';
import { LapList } from '../components/LapList';
import { Map } from '../components/Map';
import { CompletionModal } from '../components/CompletionModal';

export function Home() {
  const { elapsedTime, status, laps, start, pause, reset, recordLap } = useTimer();
  const {
    coordinates,
    currentPosition,
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sun-50 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* GPS エラー表示 */}
        {gpsError && (
          <div className="mx-4 mt-4 p-3 bg-sunset-100 border border-sunset-300 rounded-lg text-sunset-800 text-sm">
            <span className="font-semibold">⚠️ GPS エラー:</span> {gpsError}
          </div>
        )}

        {/* 地図表示（走行中のみ） */}
        {status !== 'idle' && coordinates.length > 0 && (
          <div className="px-4 pt-4">
            <Map
              coordinates={coordinates}
              currentPosition={currentPosition}
              className="h-64 md:h-80"
            />
          </div>
        )}

        {/* タイマー表示 */}
        <Timer elapsedTime={elapsedTime} />

        {/* 統計表示 */}
        {status !== 'idle' && <StatsDisplay distance={distance} pace={pace} />}

        {/* コントロールボタン */}
        <ControlButtons
          status={status}
          onStart={handleStart}
          onPause={pause}
          onReset={handleReset}
          onLap={() => recordLap(distance, pace)}
        />

        {/* GPS情報（開発用） */}
        {status !== 'idle' && (
          <div className="px-4 text-xs text-gray-500 text-center">
            GPS: {isTracking ? '追跡中' : '停止'} | 座標数: {coordinates.length}
          </div>
        )}

        {/* ラップ一覧 */}
        <LapList laps={laps} />

        {/* GPS使用の説明（初回のみ） */}
        {status === 'idle' && (
          <div className="mx-4 mt-6 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-sky-800 mb-2">💡 使い方</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• スタートボタンを押すとGPS追跡が開始されます</li>
              <li>• 走行ルートがリアルタイムで地図に表示されます</li>
              <li>• 距離とペースが自動的に計算されます</li>
              <li>• 一時停止後、終了ボタンで記録を保存します</li>
              <li>• 完了時に励ましメッセージが表示されます</li>
            </ul>
          </div>
        )}

        {/* 完了モーダル */}
        <CompletionModal
          isOpen={showCompletionModal}
          onClose={handleCloseModal}
          duration={elapsedTime}
          distance={distance}
          pace={pace}
          lapsCount={laps.length}
        />
      </div>
    </div>
  );
}
