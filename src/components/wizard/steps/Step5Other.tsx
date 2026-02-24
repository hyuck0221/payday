import { CURRENCIES } from '../../../constants/currencies';

interface Props {
  nickname: string | undefined;
  currency: string;
  onChange: (updates: { nickname?: string; currency?: string }) => void;
}

export function Step5Other({ nickname, currency, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-slate-100">
        마무리 설정 ✨
      </h2>
      <p className="text-center text-gray-500 dark:text-slate-400 text-sm mb-8">
        거의 다 왔어요! 마지막 설정이에요
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
            닉네임 (선택)
          </label>
          <input
            type="text"
            value={nickname ?? ''}
            onChange={(e) => onChange({ nickname: e.target.value || undefined })}
            placeholder="직장인 홍길동"
            maxLength={20}
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-slate-600
              bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100
              focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none
              placeholder:text-gray-300 dark:placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
            통화
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => onChange({ currency: c.code })}
                className={`py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  currency === c.code
                    ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-md'
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-600'
                }`}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
