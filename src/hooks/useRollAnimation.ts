import { useState, useRef, useCallback, useEffect } from 'react';
import { animate } from 'framer-motion';

const DRAG_THRESHOLD = 15;  // 드래그로 인식하기 위한 최소 픽셀
const TICK_MS = 80;          // 숫자 롤 인터벌
const MAX_ROLL_MS = 3000;    // 최대 롤 지속시간 (3초 후 자동 스냅백)

export type RollPhase = 'idle' | 'rolling' | 'paused' | 'snapback';

const SNAP_MESSAGES = [
  '시간은 못 돌려요... 🔧 복구 중',
  '없었던 일로 해드릴게요 ✨',
  '에러 발생: 현실 왜곡 감지 ⚙️',
  '초기화 중... 잠시만요 🛠️',
  '아 이거 건드리면 안 됐는데',
  '시간은 한 방향으로만 흘러요 ⏰',
];

export function useRollAnimation() {
  const [phase, setPhase] = useState<RollPhase>('idle');
  const [extraSec, setExtraSec] = useState(0);
  const [snapMessage, setSnapMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const isPointerDown = useRef(false); // 포인터가 실제로 눌려있는지
  const startY = useRef(0);
  const dragDelta = useRef(0);
  const dragActive = useRef(false);   // 드래그 임계값을 넘었는지
  const wasDragging = useRef(false);  // 클릭 이스터에그 충돌 방지
  const currentExtra = useRef(0);

  const rollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxRollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // 3초 강제 종료
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const msgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapRef = useRef<{ stop: () => void } | null>(null);

  const clearAll = useCallback(() => {
    if (rollTimerRef.current)    { clearInterval(rollTimerRef.current);    rollTimerRef.current = null; }
    if (maxRollTimerRef.current) { clearTimeout(maxRollTimerRef.current);  maxRollTimerRef.current = null; }
    if (pauseTimerRef.current)   { clearTimeout(pauseTimerRef.current);    pauseTimerRef.current = null; }
    if (msgTimerRef.current)     { clearTimeout(msgTimerRef.current);      msgTimerRef.current = null; }
    if (snapRef.current)         { snapRef.current.stop();                  snapRef.current = null; }
  }, []);

  const beginSnap = useCallback(() => {
    clearAll();
    const from = currentExtra.current;
    if (from === 0) { setPhase('idle'); return; }

    const msg = SNAP_MESSAGES[Math.floor(Math.random() * SNAP_MESSAGES.length)];
    setSnapMessage(msg);
    setShowMessage(true);
    setPhase('snapback');

    const anim = animate(from, 0, {
      duration: 1.3,
      ease: 'easeOut',
      onUpdate: (v: number) => {
        currentExtra.current = Math.round(v);
        setExtraSec(Math.round(v));
      },
      onComplete: () => {
        currentExtra.current = 0;
        setExtraSec(0);
        setPhase('idle');
        msgTimerRef.current = setTimeout(() => setShowMessage(false), 1200);
      },
    });
    snapRef.current = anim;
  }, [clearAll]);

  /** 롤 종료 → paused → beginSnap */
  const endRoll = useCallback(() => {
    if (rollTimerRef.current)    { clearInterval(rollTimerRef.current);   rollTimerRef.current = null; }
    if (maxRollTimerRef.current) { clearTimeout(maxRollTimerRef.current); maxRollTimerRef.current = null; }

    dragActive.current = false;

    if (currentExtra.current === 0) { setPhase('idle'); return; }

    setPhase('paused');
    pauseTimerRef.current = setTimeout(beginSnap, 500);
  }, [beginSnap]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    clearAll();
    isPointerDown.current = true;
    startY.current = e.clientY;
    dragDelta.current = 0;
    dragActive.current = false;
    wasDragging.current = false;
    currentExtra.current = 0;
    setExtraSec(0);
    setShowMessage(false);
    setPhase('idle');
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }, [clearAll]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    // 포인터가 눌려있지 않으면 완전히 무시
    if (!isPointerDown.current) return;

    const delta = e.clientY - startY.current;

    // 위로 드래그하면 롤 중단
    if (delta < 0 && dragActive.current) {
      wasDragging.current = true;
      endRoll();
      return;
    }

    if (delta < DRAG_THRESHOLD) return;

    // 처음 임계값 넘으면 롤 시작
    if (!dragActive.current) {
      dragActive.current = true;
      wasDragging.current = true;
      setPhase('rolling');

      rollTimerRef.current = setInterval(() => {
        const d = dragDelta.current;
        const speed = d < 60 ? 6 : d < 150 ? 18 : 45;
        currentExtra.current += speed;
        setExtraSec(currentExtra.current);
      }, TICK_MS);

      // 3초 후 자동 스냅백
      maxRollTimerRef.current = setTimeout(() => {
        isPointerDown.current = false;
        endRoll();
      }, MAX_ROLL_MS);
    }

    dragDelta.current = delta;
  }, [endRoll]);

  const onPointerUp = useCallback(() => {
    isPointerDown.current = false;
    if (dragActive.current) {
      wasDragging.current = true;
      endRoll();
    }
  }, [endRoll]);

  useEffect(() => () => clearAll(), [clearAll]);

  return {
    extraSec,
    phase,
    showMessage,
    snapMessage,
    wasDragging,
    pointerHandlers: { onPointerDown, onPointerMove, onPointerUp },
  };
}
