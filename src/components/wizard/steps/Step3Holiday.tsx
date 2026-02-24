import { motion } from 'framer-motion';
import { HolidayRule } from '../../../types/settings';

const OPTIONS: { rule: HolidayRule; label: string; emoji: string; desc: string; example: string }[] = [
  {
    rule: 'previous',
    label: '전날 지급',
    emoji: '⏪',
    desc: '공휴일/주말 전 마지막 영업일',
    example: '예: 월급날이 일요일 → 금요일 지급',
  },
  {
    rule: 'next',
    label: '다음날 지급',
    emoji: '⏩',
    desc: '공휴일/주말 다음 영업일',
    example: '예: 월급날이 토요일 → 월요일 지급',
  },
  {
    rule: 'none',
    label: '그냥 당일',
    emoji: '📌',
    desc: '공휴일 여부에 관계없이 그대로',
    example: '예: 설날이어도 그날 지급',
  },
];

interface Props {
  value: HolidayRule;
  onChange: (v: HolidayRule) => void;
}

export function Step3Holiday({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-slate-100">
        공휴일에는요? 🏖️
      </h2>
      <p className="text-center text-gray-500 dark:text-slate-400 text-sm mb-8">
        월급날이 공휴일/주말이면 어떻게 처리하나요?
      </p>
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => (
          <motion.button
            key={opt.rule}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(opt.rule)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              value === opt.rule
                ? 'border-purple-400 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/30 shadow-md'
                : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-200 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{opt.emoji}</span>
              <div className="flex-1">
                <div className="font-bold text-gray-800 dark:text-slate-100">{opt.label}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">{opt.desc}</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-purple-500 dark:text-purple-400 pl-11">
              {opt.example}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
