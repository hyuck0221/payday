import { AnimatePresence, motion } from 'framer-motion';
import { getCurrencySymbol } from '../../../constants/currencies';

interface Props {
  amount: number | undefined;
  elonMode: boolean;
  currency: string;
  onChangeAmount: (amount: number | undefined) => void;
  onChangeElonMode: (elonMode: boolean) => void;
}

export function Step4Amount({ amount, elonMode, currency, onChangeAmount, onChangeElonMode }: Props) {
  const symbol = getCurrencySymbol(currency);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '') {
      onChangeAmount(undefined);
    } else {
      const n = parseFloat(v.replace(/,/g, ''));
      if (!isNaN(n) && n >= 0) onChangeAmount(n);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-slate-100">
        얼마 받으세요? 💸
      </h2>
      <p className="text-center text-gray-500 dark:text-slate-400 text-sm mb-6">
        입력하면 실시간 수익 카운터를 볼 수 있어요 (선택사항)
      </p>

      <AnimatePresence mode="wait">
        {elonMode ? (
          /* ── 일론 머스크 모드 ── */
          <motion.div
            key="elon"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-400/60
              bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-5 mb-4">
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                {['✦','✧','✦','✧','✦','✧','✦','✧'].map((s, i) => (
                  <span
                    key={i}
                    className="absolute text-blue-300/30 text-xs"
                    style={{
                      top: `${10 + (i * 11) % 80}%`,
                      left: `${5 + (i * 13) % 90}%`,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="relative text-center py-2">
                <div className="text-3xl mb-2">🚀</div>
                <p className="text-blue-300 font-black text-base tracking-wide">
                  일론 머스크 모드 활성화!
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  당신은 지금 일론입니다
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChangeElonMode(false)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold
                text-gray-500 dark:text-slate-400
                bg-gray-100 dark:bg-slate-700
                hover:bg-gray-200 dark:hover:bg-slate-600
                transition-colors"
            >
              ← 원래대로 돌아가기
            </button>
          </motion.div>
        ) : (
          /* ── 일반 입력 모드 ── */
          <motion.div
            key="normal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 font-semibold text-lg">
                {symbol}
              </span>
              <input
                type="number"
                min="0"
                value={amount ?? ''}
                onChange={handleChange}
                placeholder="0"
                className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-slate-600
                  bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 text-xl font-semibold
                  focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none
                  placeholder:text-gray-300 dark:placeholder:text-slate-500"
              />
            </div>

            {amount != null && amount > 0 && (
              <div className="mb-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                <p className="text-sm text-purple-600 dark:text-purple-300 text-center">
                  ✨ 실시간으로 수익이 쌓이는 걸 볼 수 있어요!
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => onChangeElonMode(true)}
              className="w-full py-3 rounded-2xl font-bold text-sm
                bg-gradient-to-r from-slate-800 to-blue-900
                dark:from-slate-700 dark:to-blue-800
                text-blue-300 border border-blue-700/50
                hover:from-slate-700 hover:to-blue-800
                dark:hover:from-slate-600 dark:hover:to-blue-700
                transition-all hover:scale-[1.02] active:scale-100
                shadow-md hover:shadow-blue-900/30"
            >
              🚀 일론 머스크 체험하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4">
        금액은 URL에 포함되어 공유됩니다
      </p>
    </div>
  );
}
