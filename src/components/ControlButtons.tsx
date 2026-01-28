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
    <div className="flex flex-col items-center gap-6 py-8 sm:py-10 md:py-12">
      {/* メインボタン */}
      <div className="flex gap-6 sm:gap-8">
        {status === 'idle' && (
          <button
            onClick={onStart}
            className="px-12 py-6 sm:px-16 sm:py-7 rounded-full bg-white text-black font-bold text-lg sm:text-xl tracking-wide hover:bg-gray-100 active:scale-95 transition-all duration-150 shadow-2xl"
          >
            START
          </button>
        )}

        {status === 'running' && (
          <>
            <button
              onClick={onPause}
              className="px-10 py-5 sm:px-12 sm:py-6 rounded-full bg-white text-black font-bold text-base sm:text-lg tracking-wide hover:bg-gray-100 active:scale-95 transition-all duration-150"
            >
              PAUSE
            </button>
            <button
              onClick={onLap}
              className="px-10 py-5 sm:px-12 sm:py-6 rounded-full bg-gray-800 border-2 border-white text-white font-bold text-base sm:text-lg tracking-wide hover:bg-gray-700 active:scale-95 transition-all duration-150"
            >
              LAP
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button
              onClick={onStart}
              className="px-10 py-5 sm:px-12 sm:py-6 rounded-full bg-white text-black font-bold text-base sm:text-lg tracking-wide hover:bg-gray-100 active:scale-95 transition-all duration-150"
            >
              RESUME
            </button>
            <button
              onClick={onReset}
              className="px-10 py-5 sm:px-12 sm:py-6 rounded-full bg-red-600 text-white font-bold text-base sm:text-lg tracking-wide hover:bg-red-700 active:scale-95 transition-all duration-150"
            >
              FINISH
            </button>
          </>
        )}
      </div>
    </div>
  );
}
