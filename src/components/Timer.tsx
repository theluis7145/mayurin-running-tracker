import { formatTime } from '../utils/format';

interface TimerProps {
  elapsedTime: number;
}

export function Timer({ elapsedTime }: TimerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-8 md:py-12">
      <div className="text-4xl sm:text-5xl md:text-8xl font-bold text-sky-700 font-mono tracking-wider px-4">
        {formatTime(elapsedTime)}
      </div>
    </div>
  );
}
