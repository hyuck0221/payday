import { useState, useRef, useCallback } from 'react';
import { animate, AnimatePresence, motion } from 'framer-motion';
import { BicyclePump } from './BicyclePump';

interface Props {
  progressPercent: number;
}

function getGaugeColor(remaining: number): string {
  if (remaining > 60) return 'from-emerald-400 to-green-500';
  if (remaining > 35) return 'from-yellow-400 to-amber-400';
  return 'from-orange-500 to-red-500';
}

function getStatusEmoji(remaining: number): string {
  if (remaining > 80) return '💚';
  if (remaining > 60) return '💛';
  if (remaining > 35) return '🟠';
  if (remaining > 15) return '🔴';
  return '🆘';
}

function getStatusMessage(remaining: number): string {
  if (remaining > 80) return '통장에 아직 숨이 붙어 있어요';
  if (remaining > 60) return '슬슬 아껴 쓸 때가 됐군요';
  if (remaining > 35) return '지갑이 가벼워지고 있어요...';
  if (remaining > 15) return '비상금 시대 진입 중';
  return '통장 바닥 임박! 월급님 어서오세요';
}

const PUMP_START_MESSAGES = [
  '게이지 채워드릴게요! 왼쪽 펌프 눌러보세요 💪',
  '도와드릴게요~ 열심히 펌프질! 🚴‍♀️',
  '바람 넣어드릴게요! 손잡이 눌러요 🔧',
];

const DEFLATE_MESSAGES = [
  '푸슉~~ 바람 빠졌어요 😮‍💨',
  '아... 바람이 다 빠졌네요',
  '이럴 줄 알았어요 😅',
  '너무 많이 넣었나봐요 💨',
];

export function BankGauge({ progressPercent }: Props) {
  const baseRemaining = Math.max(0, 100 - progressPercent);

  // ── 펌프 이스터에그 상태 ──
  const [pumpMode, setPumpMode] = useState(false);
  const [pumpBonus, setPumpBonus] = useState(0);
  const pumpCountRef = useRef(0);
  const pumpBonusRef = useRef(0);

  // 도움말 메시지
  const [helpMsg, setHelpMsg]         = useState('');
  const [helpVisible, setHelpVisible] = useState(false);
  const msgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 오른쪽 드래그 감지
  const dragStartX    = useRef(0);
  const isDragTracking = useRef(false);

  const displayRemaining = Math.min(100, baseRemaining + pumpBonus);
  const color = getGaugeColor(displayRemaining);

  // ── 유틸 ──
  const showMsg = useCallback((text: string, dur = 3500) => {
    setHelpMsg(text);
    setHelpVisible(true);
    if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
    msgTimerRef.current = setTimeout(() => setHelpVisible(false), dur);
  }, []);

  const deflate = useCallback(() => {
    const msg = DEFLATE_MESSAGES[Math.floor(Math.random() * DEFLATE_MESSAGES.length)];
    showMsg(msg, 3000);

    const from = pumpBonusRef.current;
    animate(from, 0, {
      duration: 1.1,
      ease: [0.4, 0, 1, 1], // ease-in: 천천히 → 팍 빠짐
      onUpdate: (v: number) => {
        const val = Math.max(0, Math.round(v));
        pumpBonusRef.current = val;
        setPumpBonus(val);
      },
      onComplete: () => {
        pumpBonusRef.current = 0;
        setPumpBonus(0);
        pumpCountRef.current = 0;
        setTimeout(() => setPumpMode(false), 1800);
      },
    });
  }, [showMsg]);

  // ── 펌프 클릭 핸들러 ──
  const handlePump = useCallback(() => {
    pumpCountRef.current += 1;

    if (pumpCountRef.current >= 50) {
      deflate();
      return;
    }

    // 펌프 1번 = +2% 보너스 (최대 100 - baseRemaining까지만 가시적으로 차오름)
    const newBonus = pumpBonusRef.current + 2;
    pumpBonusRef.current = newBonus;
    setPumpBonus(newBonus);
  }, [deflate]);

  // ── 게이지 바 드래그 감지 ──
  const onFillPointerDown = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragTracking.current = true;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }, []);

  const onFillPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragTracking.current || pumpMode) return;
    if (baseRemaining >= 30) return; // 30% 이상이면 비활성
    const dx = e.clientX - dragStartX.current;
    if (dx > 20) {
      isDragTracking.current = false;
      setPumpMode(true);
      const msg = PUMP_START_MESSAGES[Math.floor(Math.random() * PUMP_START_MESSAGES.length)];
      showMsg(msg, 4500);
    }
  }, [pumpMode, baseRemaining, showMsg]);

  const onFillPointerUp = useCallback(() => {
    isDragTracking.current = false;
  }, []);

  return (
    <div className="w-full relative">

      {/* 펌프 — 왼쪽 밖으로 절대 위치 */}
      <AnimatePresence>
        {pumpMode && (
          <motion.div
            key="pump"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.3 }}
            className="absolute right-full top-0 bottom-0 flex items-center pr-1"
            style={{ pointerEvents: 'auto' }}
          >
            <BicyclePump onPump={handlePump} />
          </motion.div>
        )}
      </AnimatePresence>


      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🏦</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            통장 잔고 게이지
          </span>
        </div>
        <span className="text-sm font-black text-gray-700 dark:text-slate-200">
          {displayRemaining.toFixed(1)}%
        </span>
      </div>

      {/* 게이지 바 */}
      <div className="w-full h-5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden
        border border-gray-200 dark:border-slate-600 shadow-inner">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full relative
            ${!pumpMode && baseRemaining < 30 ? 'cursor-ew-resize' : ''}`}
          initial={{ width: '100%' }}
          animate={{ width: `${displayRemaining}%` }}
          transition={{ duration: pumpMode ? 0.25 : 1.5, ease: 'easeOut' }}
          onPointerDown={onFillPointerDown}
          onPointerMove={onFillPointerMove}
          onPointerUp={onFillPointerUp}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full" />
        </motion.div>
      </div>

      {/* 눈금 */}
      <div className="flex justify-between mt-1 px-0.5">
        {[0, 25, 50, 75, 100].map((v) => (
          <span key={v} className="text-[9px] text-gray-300 dark:text-slate-600 font-medium">
            {v}%
          </span>
        ))}
      </div>

      {/* 상태 메시지 / 펌프 도움말 메시지 */}
      <div className="mt-2 h-4 relative">
        <AnimatePresence mode="wait">
          {helpVisible ? (
            <motion.p
              key="helpmsg"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 text-center text-xs font-semibold
                text-emerald-600 dark:text-emerald-400 pointer-events-none"
            >
              {helpMsg}
            </motion.p>
          ) : (
            <motion.p
              key={Math.floor(displayRemaining / 20)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 text-center text-xs font-medium
                text-gray-500 dark:text-slate-400 pointer-events-none"
            >
              {getStatusEmoji(displayRemaining)} {getStatusMessage(displayRemaining)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
