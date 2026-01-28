import { useState, useRef, useCallback } from 'react';
import { Lap, TimerStatus } from '../types';

export function useTimer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [laps, setLaps] = useState<Lap[]>([]);

  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // タイマー開始
  const start = useCallback(() => {
    if (status === 'running') return;

    const now = Date.now();
    if (status === 'idle') {
      startTimeRef.current = now;
      pausedTimeRef.current = 0;
    } else if (status === 'paused') {
      // 一時停止からの再開
      startTimeRef.current = now - pausedTimeRef.current;
    }

    setStatus('running');

    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setElapsedTime(elapsed);
    }, 10); // 10msごとに更新
  }, [status]);

  // タイマー一時停止
  const pause = useCallback(() => {
    if (status !== 'running') return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    pausedTimeRef.current = elapsedTime;
    setStatus('paused');
  }, [status, elapsedTime]);

  // タイマーリセット
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setElapsedTime(0);
    setStatus('idle');
    setLaps([]);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
  }, []);

  // ラップを記録
  const recordLap = useCallback(
    (distance: number = 0, pace: number = 0) => {
      const lapNumber = laps.length + 1;
      const previousLapTime = laps.length > 0 ? laps[laps.length - 1].elapsedTime : 0;
      const splitTime = elapsedTime - previousLapTime;

      const newLap: Lap = {
        lapNumber,
        elapsedTime,
        splitTime,
        distance,
        pace,
      };

      setLaps(prev => [...prev, newLap]);
    },
    [elapsedTime, laps]
  );

  return {
    elapsedTime,
    status,
    laps,
    start,
    pause,
    reset,
    recordLap,
  };
}
