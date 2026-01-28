import { Lap } from '../types';
import { formatTime, formatDistance, formatSpeed } from '../utils/format';

interface LapListProps {
  laps: Lap[];
}

export function LapList({ laps }: LapListProps) {
  if (laps.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 px-4 pb-3">
      <h3 className="text-base sm:text-lg font-semibold text-sky-800 mb-2">ラップ記録</h3>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="max-h-36 sm:max-h-48 md:max-h-64 overflow-y-auto">
          {[...laps].reverse().map((lap) => (
            <div
              key={lap.lapNumber}
              className="flex items-center justify-between p-3 sm:p-3 border-b border-sky-100 last:border-b-0"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-sky-100 rounded-full text-sky-700 font-semibold text-xs">
                  {lap.lapNumber}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    区間: {formatTime(lap.splitTime)}
                  </div>
                  <div className="text-xs text-gray-500">
                    経過: {formatTime(lap.elapsedTime)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {lap.distance > 0 && (
                  <div className="text-sm text-gray-600">
                    {formatDistance(lap.distance)}
                  </div>
                )}
                {lap.pace > 0 && (
                  <div className="text-xs text-gray-500">
                    {formatSpeed(lap.pace)} km/h
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
