import { PayType } from '../../../types/settings';
import { getDayOfWeekLabel } from '../../../utils/formatters';

interface Props {
  payType: PayType;
  dayOfMonth: number;
  dayOfWeek: number;
  hour: number;
  minute: number;
  onChange: (updates: { dayOfMonth?: number; dayOfWeek?: number; hour?: number; minute?: number }) => void;
}

const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6];

export function Step2Payday({ payType, dayOfMonth, dayOfWeek, hour, minute, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-slate-100">
        언제 받으세요? 📆
      </h2>
      <p className="text-center text-gray-500 dark:text-slate-400 text-sm mb-8">
        급여 지급일과 시간을 설정해 주세요
      </p>

      {payType === 'monthly' && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
            매월 몇 일?
          </label>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                onClick={() => onChange({ dayOfMonth: d })}
                className={`h-9 rounded-xl text-sm font-medium transition-all ${
                  dayOfMonth === d
                    ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-md'
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {payType === 'weekly' && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
            매주 무슨 요일?
          </label>
          <div className="flex gap-2 justify-center">
            {DAYS_OF_WEEK.map((dow) => (
              <button
                key={dow}
                onClick={() => onChange({ dayOfWeek: dow })}
                className={`w-11 h-11 rounded-2xl text-sm font-bold transition-all ${
                  dayOfWeek === dow
                    ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-md'
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-600'
                }`}
              >
                {getDayOfWeekLabel(dow)}
              </button>
            ))}
          </div>
        </div>
      )}

      {payType === 'hourly' && (
        <div className="mb-6 text-center py-6">
          <div className="text-5xl mb-3">⏰</div>
          <p className="text-gray-600 dark:text-slate-300 font-medium">
            매 시간 정각에 카운트다운됩니다
          </p>
        </div>
      )}

      {payType !== 'hourly' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
            지급 시간
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <select
                value={hour}
                onChange={(e) => onChange({ hour: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-600
                  bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100
                  focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none text-center font-semibold"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}시</option>
                ))}
              </select>
            </div>
            <span className="text-2xl font-bold text-gray-400">:</span>
            <div className="flex-1">
              <select
                value={minute}
                onChange={(e) => onChange({ minute: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-600
                  bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100
                  focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none text-center font-semibold"
              >
                {[0, 10, 20, 30, 40, 50].map((m) => (
                  <option key={m} value={m}>{String(m).padStart(2, '0')}분</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
