import { formatDistance, formatPace } from '../utils/format';

interface StatsDisplayProps {
  distance: number;
  pace: number;
}

export function StatsDisplay({ distance, pace }: StatsDisplayProps) {
  return (
    <div className="flex justify-center gap-6 sm:gap-12 py-6 px-4">
      <div className="text-center min-w-[100px]">
        <div className="text-4xl sm:text-5xl font-bold text-sky-700 mb-1">
          {formatDistance(distance)}
        </div>
        <div className="text-sm sm:text-base text-gray-500 font-medium">距離</div>
      </div>
      <div className="text-center min-w-[100px]">
        <div className="text-4xl sm:text-5xl font-bold text-sky-700 mb-1">
          {formatPace(pace)}
        </div>
        <div className="text-sm sm:text-base text-gray-500 font-medium">ペース (分/km)</div>
      </div>
    </div>
  );
}
