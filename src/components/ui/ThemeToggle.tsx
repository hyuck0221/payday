import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Theme } from '../../types/settings';

const EYE_MESSAGES = [
  '눈 안 아파요? 🌀',
  '그만 좀 눌러요 제발 👀',
  '눈 버려요 진짜로',
  '라이트모드 다크모드 왔다갔다하면 눈 망가져요 🥲',
  '안과 가봤어요? 🏥',
  '그렇게 해도 월급날은 안 당겨져요',
  '테마가 뭔 죄예요',
];

interface Props {
  theme: Theme;
  onToggle: (t: Theme) => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const clickTimestamps = useRef<number[]>([]);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cycle = (): Theme => {
    if (theme === 'light') return 'dark';
    if (theme === 'dark') return 'system';
    return 'light';
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  const handleClick = () => {
    onToggle(cycle());

    const now = Date.now();
    clickTimestamps.current = clickTimestamps.current.filter((t) => now - t < 5000);
    clickTimestamps.current.push(now);

    if (clickTimestamps.current.length >= 20) {
      clickTimestamps.current = [];
      const text = EYE_MESSAGES[Math.floor(Math.random() * EYE_MESSAGES.length)];
      setMsg(text);
      setVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setVisible(false), 2500);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        title="테마 변경"
        className="p-2 rounded-full text-gray-400 hover:text-purple-500 dark:text-slate-400
          dark:hover:text-purple-400 transition-colors"
      >
        <Icon size={18} />
      </button>

      <AnimatePresence>
        {visible && (
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
