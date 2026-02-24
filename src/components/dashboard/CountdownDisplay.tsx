import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CountdownUnit } from './CountdownUnit';
import { CountdownState } from '../../types/settings';
import { Toast } from '../ui/Toast';
import { useClickEasterEgg } from '../../hooks/useClickEasterEgg';
import { useRollAnimation } from '../../hooks/useRollAnimation';

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
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const detectClick = useClickEasterEgg(5, 1500);
  const { extraSec, phase, showMessage, snapMessage, wasDragging, pointerHandlers } =
    useRollAnimation();

  // 실제 남은 초 + 드래그 오프셋 → 분해
  const baseSec = Math.max(0, Math.floor(state.totalMs / 1000));
  const displaySec     = baseSec + extraSec;
  const displayDays    = Math.floor(displaySec / 86400);
  const displayHours   = Math.floor((displaySec % 86400) / 3600);
  const displayMinutes = Math.floor((displaySec % 3600) / 60);
  const displaySeconds = displaySec % 60;

  const isRolling  = phase === 'rolling';
  const isSnapback = phase === 'snapback';

  const handleClick = useCallback(() => {
    if (wasDragging.current) { wasDragging.current = false; return; }
    detectClick(() => {
      const msg = NAUGHTY_MESSAGES[Math.floor(Math.random() * NAUGHTY_MESSAGES.length)];
      setToastMsg(msg);
      setToastVisible(true);
      if (toastTimer) clearTimeout(toastTimer);
      const timer = setTimeout(() => setToastVisible(false), 2500);
      setToastTimer(timer);
    });
  }, [detectClick, toastTimer, wasDragging]);

  return (
    <>
      {/* 스냅백 메시지 — absolute로 레이아웃 영향 없음 */}
      <div className="relative">
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 -top-4 whitespace-nowrap
                text-xs font-semibold text-orange-500 dark:text-orange-400 pointer-events-none"
            >
              {snapMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 숫자 영역 */}
      <div
        className={[
          'flex items-center justify-center gap-3 sm:gap-4 select-none touch-none',
          isRolling ? 'cursor-grabbing' : 'cursor-grab',
        ].join(' ')}
        onClick={handleClick}
        {...pointerHandlers}
      >
        <CountdownUnit value={displayDays}    label="일"   fast={isRolling} reversed={isSnapback} />
        <Separator />
        <CountdownUnit value={displayHours}   label="시간" fast={isRolling} reversed={isSnapback} />
        <Separator />
        <CountdownUnit value={displayMinutes} label="분"   fast={isRolling} reversed={isSnapback} />
        <Separator />
        <CountdownUnit value={displaySeconds} label="초"   fast={isRolling} reversed={isSnapback} />
      </div>

      {/* 클릭 연타 이스터에그 토스트 */}
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
