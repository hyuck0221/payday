import { motion } from 'framer-motion';
import { PayType } from '../../../types/settings';

const OPTIONS: { type: PayType; label: string; emoji: string; desc: string }[] = [
  { type: 'monthly', label: '월급', emoji: '📅', desc: '매달 정해진 날' },
  { type: 'weekly', label: '주급', emoji: '🗓️', desc: '매주 정해진 요일' },
  { type: 'daily', label: '일급', emoji: '☀️', desc: '매일 정해진 시간' },
  { type: 'hourly', label: '시급', emoji: '⏰', desc: '시간마다' },
];

interface Props {
  value: PayType;
  onChange: (v: PayType) => void;
}

export function Step1PayType({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-slate-100">
        어떻게 받으세요? 💰
      </h2>
      <p className="text-center text-gray-500 dark:text-slate-400 text-sm mb-8">
        급여 주기를 선택해 주세요
      </p>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <motion.button
            key={opt.type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt.type)}
            className={`p-5 rounded-2xl border-2 text-left transition-all ${
              value === opt.type
                ? 'border-purple-400 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/30 shadow-md'
                : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-200 dark:hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">{opt.emoji}</div>
            <div className="font-bold text-gray-800 dark:text-slate-100">{opt.label}</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
