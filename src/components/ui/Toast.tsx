import { AnimatePresence, motion } from 'framer-motion';

interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
            bg-slate-800 dark:bg-slate-700 text-white text-sm font-semibold
            px-5 py-3 rounded-2xl shadow-xl pointer-events-none
            border border-slate-600 dark:border-slate-500"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
