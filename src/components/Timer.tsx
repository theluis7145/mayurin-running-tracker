import { formatTime } from '../utils/format';

interface TimerProps {
  elapsedTime: number;
}

export function Timer({ elapsedTime }: TimerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-6xl md:text-8xl font-bold text-sky-700 font-mono tracking-wider">
        {formatTime(elapsedTime)}
      </div>
    </div>
  );
}
