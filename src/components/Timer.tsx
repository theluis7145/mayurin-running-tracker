import { formatTime } from '../utils/format';

interface TimerProps {
  elapsedTime: number;
}

export function Timer({ elapsedTime }: TimerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
      <div className="text-5xl sm:text-7xl md:text-9xl font-bold text-white font-mono tracking-tight">
        {formatTime(elapsedTime)}
      </div>
    </div>
  );
}
