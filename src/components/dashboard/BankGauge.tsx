import { motion } from 'framer-motion';

interface Props {
  progressPercent: number; // 급여 주기 경과 비율 (0~100)
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

export function BankGauge({ progressPercent }: Props) {
  const remaining = Math.max(0, 100 - progressPercent);
  const color = getGaugeColor(remaining);

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🏦</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            통장 잔고 게이지
          </span>
        </div>
        <span className="text-sm font-black text-gray-700 dark:text-slate-200">
          {remaining.toFixed(1)}%
        </span>
      </div>

      {/* 게이지 바 */}
      <div className="w-full h-5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden
        border border-gray-200 dark:border-slate-600 shadow-inner">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full relative`}
          initial={{ width: '100%' }}
          animate={{ width: `${remaining}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          {/* 광택 효과 */}
          <div className="absolute inset-0 bg-white/20 rounded-full" />
        </motion.div>
      </div>

      {/* 눈금 표시 */}
      <div className="flex justify-between mt-1 px-0.5">
        {[0, 25, 50, 75, 100].map((v) => (
          <span key={v} className="text-[9px] text-gray-300 dark:text-slate-600 font-medium">
            {v}%
          </span>
        ))}
      </div>

      {/* 상태 메시지 */}
      <motion.p
        key={Math.floor(remaining / 20)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-xs font-medium text-gray-500 dark:text-slate-400 mt-2"
      >
        {getStatusEmoji(remaining)} {getStatusMessage(remaining)}
      </motion.p>
    </div>
  );
}
