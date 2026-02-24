import { motion } from 'framer-motion';
import { Settings, Theme } from '../../types/settings';
import { CountdownState } from '../../types/settings';
import { CountdownDisplay } from './CountdownDisplay';
import { ProgressBar } from './ProgressBar';
import { EarningsCounter } from './EarningsCounter';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ShareButton } from '../ui/ShareButton';
import { formatDate, getMotivationalMessage } from '../../utils/formatters';
import { Pencil } from 'lucide-react';

interface Props {
  settings: Settings;
  state: CountdownState;
  onEdit: () => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}

export function Dashboard({ settings, state, onEdit, theme, onThemeChange }: Props) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            월급날 카운트다운 💰
          </h1>
          {settings.nickname && (
            <p className="text-sm text-gray-500 dark:text-slate-400">{settings.nickname}님의 월급날</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onThemeChange} />
          <ShareButton />
          <button
            onClick={onEdit}
            title="설정 변경"
            className="p-2 rounded-full text-gray-400 hover:text-purple-500 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
          >
            <Pencil size={18} />
          </button>
        </div>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-xl p-7"
      >
        {/* Motivational message */}
        <p className="text-center text-sm font-medium text-purple-500 dark:text-purple-400 mb-6">
          {getMotivationalMessage(state.days)}
        </p>

        {/* Countdown */}
        <CountdownDisplay state={state} />

        {/* Next payday date */}
        <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-5">
          다음 월급날: {formatDate(state.nextPayday)}
        </p>

        {/* Progress bar */}
        <div className="mt-6">
          <ProgressBar percent={state.progressPercent} />
        </div>

        {/* Earnings counter */}
        {settings.amount != null && settings.amount > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
            <EarningsCounter earned={state.earned} currency={settings.currency} />
          </div>
        )}
      </motion.div>

      <p className="mt-4 text-xs text-gray-400 dark:text-slate-600 text-center">
        URL을 공유하면 설정이 그대로 전달돼요 🔗
      </p>
    </div>
  );
}
