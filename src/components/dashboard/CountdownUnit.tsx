import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  value: number;
  label: string;
}

export function CountdownUnit({ value, label }: Props) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center
        bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
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
