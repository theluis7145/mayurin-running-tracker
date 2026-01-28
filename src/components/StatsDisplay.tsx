import { formatDistance, formatPace } from '../utils/format';

interface StatsDisplayProps {
  distance: number;
  pace: number;
}

export function StatsDisplay({ distance, pace }: StatsDisplayProps) {
  return (
    <div className="flex justify-center gap-8 py-6 px-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-sky-700">
          {formatDistance(distance)}
        </div>
        <div className="text-sm text-gray-500 mt-1">距離</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-sky-700">
          {formatPace(pace)}
        </div>
        <div className="text-sm text-gray-500 mt-1">ペース (分/km)</div>
      </div>
    </div>
  );
}
