import { Theme } from '../../../types/settings';
import { CURRENCIES } from '../../../constants/currencies';

const THEME_OPTIONS: { value: Theme; label: string; emoji: string }[] = [
  { value: 'light', label: '라이트', emoji: '☀️' },
  { value: 'dark', label: '다크', emoji: '🌙' },
  { value: 'system', label: '시스템', emoji: '💻' },
];

interface Props {
  nickname: string | undefined;
  currency: string;
  theme: Theme;
  onChange: (updates: { nickname?: string; currency?: string; theme?: Theme }) => void;
}

export function Step5Other({ nickname, currency, theme, onChange }: Props) {
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
            테마
          </label>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.value}
                onClick={() => onChange({ theme: t.value })}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  theme === t.value
                    ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-md'
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-600'
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
