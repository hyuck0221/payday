import { useState, useCallback } from 'react';
import { CountdownUnit } from './CountdownUnit';
import { CountdownState } from '../../types/settings';
import { Toast } from '../ui/Toast';
import { useClickEasterEgg } from '../../hooks/useClickEasterEgg';

const NAUGHTY_MESSAGES = [
  '숫자 만지지 마세요 🤚',
  '빨리 간다고 바뀌는 거 아니에요 😅',
  '그렇게 해도 월급날은 안 당겨져요',
  '제발 기다려 주세요... 🙏',
  '숫자가 부끄러워해요 😳',
  '손 치워요! 퇴근하고 만져요',
];

interface Props {
  state: CountdownState;
}

export function CountdownDisplay({ state }: Props) {
  const { days, hours, minutes, seconds } = state;
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const detectClick = useClickEasterEgg(5, 1500);

  const handleClick = useCallback(() => {
    detectClick(() => {
      const msg = NAUGHTY_MESSAGES[Math.floor(Math.random() * NAUGHTY_MESSAGES.length)];
      setToastMsg(msg);
      setToastVisible(true);

      if (toastTimer) clearTimeout(toastTimer);
      const timer = setTimeout(() => setToastVisible(false), 2500);
      setToastTimer(timer);
    });
  }, [detectClick, toastTimer]);

  return (
    <>
      <div
        className="flex items-center justify-center gap-3 sm:gap-4 cursor-default select-none"
        onClick={handleClick}
      >
        <CountdownUnit value={days} label="일" />
        <Separator />
        <CountdownUnit value={hours} label="시간" />
        <Separator />
        <CountdownUnit value={minutes} label="분" />
        <Separator />
        <CountdownUnit value={seconds} label="초" />
      </div>

      <Toast message={toastMsg} visible={toastVisible} />
    </>
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
