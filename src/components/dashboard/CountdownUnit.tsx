import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  value: number;
  label: string;
  fast?: boolean;     // 롤 중 빠른 전환 (60ms)
  reversed?: boolean; // 스냅백 시 아래→위 방향
}

export function CountdownUnit({ value, label, fast = false, reversed = false }: Props) {
  const display = String(value).padStart(2, '0');

  // 기본: 위에서 내려옴 (initial y=-36, exit y=+36)
  // 스냅백: 아래에서 올라옴 (initial y=+36, exit y=-36)
  const enterY = reversed ? 36 : -36;
  const exitY  = reversed ? -36 : 36;
  const dur    = fast ? 0.06 : reversed ? 0.12 : 0.25;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center
          bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: enterY, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: exitY, opacity: 0 }}
            transition={{ duration: dur, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text
              bg-gradient-to-br from-pink-500 to-purple-600 select-none"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-xs font-semibold text-gray-500 dark:text-slate-400 tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
}
