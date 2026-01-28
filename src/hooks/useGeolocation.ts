import { useState, useEffect, useRef, useCallback } from 'react';
import { Coordinate } from '../types';

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  minAccuracy?: number; // 精度フィルタリング（メートル）
}

interface GeolocationState {
  coordinates: Coordinate[];
  currentPosition: Coordinate | null;
  isTracking: boolean;
  error: string | null;
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    minAccuracy = 50, // 50m以上の誤差は除外
  } = options;

  const [state, setState] = useState<GeolocationState>({
    coordinates: [],
    currentPosition: null,
    isTracking: false,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);

  // GPS追跡を開始
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'お使いのブラウザはGPSに対応してないみたい',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isTracking: true, error: null }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // 精度フィルタリング
        if (accuracy > minAccuracy) {
          console.warn(`GPS精度が低すぎます: ${accuracy}m`);
          return;
        }

        const newCoordinate: Coordinate = {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
          accuracy,
        };

        setState((prev) => ({
          ...prev,
          coordinates: [...prev.coordinates, newCoordinate],
          currentPosition: newCoordinate,
        }));
      },
      (error) => {
        let errorMessage = 'GPS位置情報の取得に失敗しちゃった';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'GPS位置情報の使用が拒否されちゃった。ブラウザの設定を確認してね';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'GPS位置情報を取得できないみたい';
            break;
          case error.TIMEOUT:
            errorMessage = 'GPS位置情報の取得がタイムアウトしちゃった';
            break;
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isTracking: false,
        }));
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge, minAccuracy]);

  // GPS追跡を停止
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState((prev) => ({ ...prev, isTracking: false }));
  }, []);

  // リセット
  const reset = useCallback(() => {
    stopTracking();
    setState({
      coordinates: [],
      currentPosition: null,
      isTracking: false,
      error: null,
    });
  }, [stopTracking]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    coordinates: state.coordinates,
    currentPosition: state.currentPosition,
    isTracking: state.isTracking,
    error: state.error,
    startTracking,
    stopTracking,
    reset,
  };
}
