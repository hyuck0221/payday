import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';

const ALREADY_COPIED_MESSAGES = [
  '이미 복사됐어요 😅',
  '한 번이면 충분해요',
  '클립보드에 잘 있어요 📋',
  '또 눌러도 똑같아요',
  '진짜로 이미 복사됐다고요',
];

const GONE_MESSAGES = [
  '...알겠어요, 없애드릴게요',
  '그렇게 원하신다면야',
  '버튼이 삐졌어요',
];

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [gone, setGone] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgVisible, setMsgVisible] = useState(false);

  // 체크 상태일 때 클릭 횟수
  const checkClickCount = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMsg = (text: string) => {
    setMsg(text);
    setMsgVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setMsgVisible(false), 2500);
  };

  const handleShare = async () => {
    // 체크 상태에서 누른 경우
    if (copied) {
      checkClickCount.current += 1;

      if (checkClickCount.current >= 10) {
        // 10번 → 버튼 사라짐
        const text = GONE_MESSAGES[Math.floor(Math.random() * GONE_MESSAGES.length)];
        showMsg(text);
        setTimeout(() => setGone(true), 1000);
        return;
      }

      if (checkClickCount.current === 5) {
        // 정확히 5번째에만 딱 한 번 문구 표시
        const text = ALREADY_COPIED_MESSAGES[Math.floor(Math.random() * ALREADY_COPIED_MESSAGES.length)];
        showMsg(text);
        return;
      }

      return;
    }

    // 일반 복사
    checkClickCount.current = 0;
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => {
      setCopied(false);
      checkClickCount.current = 0;
    }, 2000);
  };

  if (gone) return null;

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        title={copied ? '복사됨!' : 'URL 복사'}
        className="p-2 rounded-full text-gray-400 hover:text-purple-500 dark:text-slate-400
          dark:hover:text-purple-400 transition-colors"
      >
        {copied
          ? <Check size={18} className="text-green-500" />
          : <Share2 size={18} />}
      </button>

      <AnimatePresence>
        {msgVisible && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-10 right-0 z-50 whitespace-nowrap
              bg-slate-800 dark:bg-slate-700 text-white text-xs font-semibold
              px-3 py-2 rounded-xl shadow-lg pointer-events-none
              border border-slate-600"
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
