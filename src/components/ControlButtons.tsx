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
    <div className="flex flex-col items-center gap-4 py-8 px-4">
      {/* メインボタン */}
      <div className="flex gap-4">
        {status === 'idle' && (
          <button
            onClick={onStart}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            スタート
          </button>
        )}

        {status === 'running' && (
          <>
            <button
              onClick={onPause}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-sun-400 to-sun-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              一時停止
            </button>
            <button
              onClick={onLap}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              ラップ
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button
              onClick={onStart}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              再開
            </button>
            <button
              onClick={onReset}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-sunset-400 to-sunset-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              終了
            </button>
          </>
        )}
      </div>
    </div>
  );
}
