import { motion } from 'framer-motion';

interface Props {
  percent: number;
}

export function ProgressBar({ percent }: Props) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2">
        <span>이번 급여 주기</span>
        <span>{percent.toFixed(1)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
