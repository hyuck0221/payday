import { CountdownUnit } from './CountdownUnit';
import { CountdownState } from '../../types/settings';

interface Props {
  state: CountdownState;
}

export function CountdownDisplay({ state }: Props) {
  const { days, hours, minutes, seconds } = state;

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <CountdownUnit value={days} label="일" />
      <Separator />
      <CountdownUnit value={hours} label="시간" />
      <Separator />
      <CountdownUnit value={minutes} label="분" />
      <Separator />
      <CountdownUnit value={seconds} label="초" />
    </div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="w-1.5 h-1.5 rounded-full bg-purple-300 dark:bg-purple-600" />
      <div className="w-1.5 h-1.5 rounded-full bg-purple-300 dark:bg-purple-600" />
    </div>
  );
}
