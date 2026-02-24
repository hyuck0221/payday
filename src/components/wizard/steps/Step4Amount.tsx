import { getCurrencySymbol } from '../../../constants/currencies';

interface Props {
  amount: number | undefined;
  currency: string;
  onChange: (amount: number | undefined) => void;
}

export function Step4Amount({ amount, currency, onChange }: Props) {
  const symbol = getCurrencySymbol(currency);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '') {
      onChange(undefined);
    } else {
      const n = parseFloat(v.replace(/,/g, ''));
      if (!isNaN(n) && n >= 0) onChange(n);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-slate-100">
        얼마 받으세요? 💸
      </h2>
      <p className="text-center text-gray-500 dark:text-slate-400 text-sm mb-8">
        입력하면 실시간 수익 카운터를 볼 수 있어요 (선택사항)
      </p>

      <div className="relative">
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
        <div className="mt-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
          <p className="text-sm text-purple-600 dark:text-purple-300 text-center">
            ✨ 실시간으로 수익이 쌓이는 걸 볼 수 있어요!
          </p>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4">
        금액은 URL에 포함되어 공유됩니다
      </p>
    </div>
  );
}
