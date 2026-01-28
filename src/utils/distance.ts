import { Coordinate } from '../types';

/**
 * Haversine公式を使用して2点間の距離を計算（km単位）
 */
export function calculateDistance(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number {
  const R = 6371; // 地球の半径（km）

  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);
  const deltaLat = toRadians(coord2.latitude - coord1.latitude);
  const deltaLon = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 座標配列から総距離を計算
 */
export function calculateTotalDistance(coordinates: Coordinate[]): number {
  if (coordinates.length < 2) return 0;

  let totalDistance = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const distance = calculateDistance(coordinates[i - 1], coordinates[i]);
    totalDistance += distance;
  }

  return totalDistance;
}

/**
 * ペースを計算（分/km）
 */
export function calculatePace(distanceKm: number, durationMs: number): number {
  if (distanceKm <= 0 || durationMs <= 0) return 0;

  const durationMinutes = durationMs / 1000 / 60;
  return durationMinutes / distanceKm;
}

/**
 * 度をラジアンに変換
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
