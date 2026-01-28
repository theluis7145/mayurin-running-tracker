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
    <div className="mt-8 pb-6">
      <h3 className="text-sm sm:text-base font-bold text-gray-400 tracking-wider mb-4">LAPS</h3>
      <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800">
        <div className="max-h-48 sm:max-h-64 overflow-y-auto">
          {[...laps].reverse().map((lap) => (
            <div
              key={lap.lapNumber}
              className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800 last:border-b-0 hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-full font-bold text-sm">
                  {lap.lapNumber}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {formatTime(lap.splitTime)}
                  </div>
                  <div className="text-xs text-gray-400">
                    Total: {formatTime(lap.elapsedTime)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {lap.distance > 0 && (
                  <div className="text-sm font-semibold text-white">
                    {formatDistance(lap.distance)}
                  </div>
                )}
                {lap.pace > 0 && (
                  <div className="text-xs text-gray-400">
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
