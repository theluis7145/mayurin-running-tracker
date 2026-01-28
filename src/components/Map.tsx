import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Coordinate } from '../types';

interface MapProps {
  coordinates: Coordinate[];
  currentPosition: Coordinate | null;
  className?: string;
}

// 地図の中心を現在位置に更新するコンポーネント
function MapUpdater({ center }: { center: LatLngExpression | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
}

export function Map({ coordinates, currentPosition, className = '' }: MapProps) {
  // デフォルトの中心位置（東京）
  const defaultCenter: LatLngExpression = [35.6762, 139.6503];

  // 現在位置または最後の座標を中心に設定
  const center: LatLngExpression = currentPosition
    ? [currentPosition.latitude, currentPosition.longitude]
    : coordinates.length > 0
    ? [coordinates[coordinates.length - 1].latitude, coordinates[coordinates.length - 1].longitude]
    : defaultCenter;

  // 座標をLeaflet形式に変換
  const positions: LatLngExpression[] = coordinates.map((coord) => [
    coord.latitude,
    coord.longitude,
  ]);

  // カスタムアイコン（現在位置マーカー）
  const currentPositionIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="#60a5fa" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={false}
        className="w-full h-full rounded-lg shadow-md"
        style={{ minHeight: '300px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        />

        {/* 走行ルート */}
        {positions.length > 1 && (
          <Polyline positions={positions} color="#60a5fa" weight={5} opacity={0.9} />
        )}

        {/* 現在位置マーカー */}
        {currentPosition && (
          <Marker
            position={[currentPosition.latitude, currentPosition.longitude]}
            icon={currentPositionIcon}
          />
        )}

        {/* 地図の中心を更新 */}
        <MapUpdater center={currentPosition ? [currentPosition.latitude, currentPosition.longitude] : null} />
      </MapContainer>

      {/* GPS精度表示 */}
      {currentPosition && (
        <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-80 px-3 py-1 rounded-full shadow-md text-xs text-white">
          精度: ±{Math.round(currentPosition.accuracy)}m
        </div>
      )}
    </div>
  );
}
