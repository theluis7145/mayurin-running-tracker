import { TimerStatus } from '../types';

interface ControlButtonsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
}

export function ControlButtons({
  status,
  onStart,
  onPause,
  onReset,
  onLap,
}: ControlButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 sm:py-6 md:py-8 px-4">
      {/* メインボタン */}
      <div className="flex gap-4 sm:gap-6">
        {status === 'idle' && (
          <button
            onClick={onStart}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white font-bold text-xl shadow-lg active:shadow-xl active:scale-95 transition-all duration-150"
          >
            スタート
          </button>
        )}

        {status === 'running' && (
          <>
            <button
              onClick={onPause}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-sun-400 to-sun-600 text-white font-bold text-xl shadow-lg active:shadow-xl active:scale-95 transition-all duration-150"
            >
              一時停止
            </button>
            <button
              onClick={onLap}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 text-white font-bold text-xl shadow-lg active:shadow-xl active:scale-95 transition-all duration-150"
            >
              ラップ
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button
              onClick={onStart}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white font-bold text-xl shadow-lg active:shadow-xl active:scale-95 transition-all duration-150"
            >
              再開
            </button>
            <button
              onClick={onReset}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-sunset-400 to-sunset-600 text-white font-bold text-xl shadow-lg active:shadow-xl active:scale-95 transition-all duration-150"
            >
              終了
            </button>
          </>
        )}
      </div>
    </div>
  );
}
