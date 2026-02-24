import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, Theme } from '../../types/settings';
import { CountdownState } from '../../types/settings';
import { CountdownDisplay } from './CountdownDisplay';
import { ProgressBar } from './ProgressBar';
import { BankGauge } from './BankGauge';
import { AnalogCountdown } from './AnalogCountdown';
import { EarningsCounter } from './EarningsCounter';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ShareButton } from '../ui/ShareButton';
import { ShootingStars } from '../ui/ShootingStars';
import { formatDate, getMotivationalMessage } from '../../utils/formatters';
import { Pencil } from 'lucide-react';

type ViewMode = 'countdown' | 'analog';
type ProgressMode = 'default' | 'bank';

const LATE_NIGHT_MESSAGES = [
  '이 시간에 월급날 보는 거... 저도 알아요 🌙',
  '자야 하는데... 월급날은 언제 오는 걸까 🌙',
  '새벽에 통장 보는 당신, 내일 힘내세요 🌙',
  '야행성 직장인 발견 🦉 월급날 곧 올 거예요',
  '이 시간까지 깨어있다니... 출근은 괜찮겠어요? 🌙',
];

interface Props {
  settings: Settings;
  state: CountdownState;
  onEdit: () => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}

export function Dashboard({ settings, state, onEdit, theme, onThemeChange }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('payday-view-mode') as ViewMode) ?? 'countdown';
  });

  const [progressMode, setProgressMode] = useState<ProgressMode>(() => {
    return (localStorage.getItem('payday-progress-mode') as ProgressMode) ?? 'default';
  });

  const [lateNightMsg] = useState(
    () => LATE_NIGHT_MESSAGES[Math.floor(Math.random() * LATE_NIGHT_MESSAGES.length)],
  );
  const currentHour = new Date().getHours();
  const isLateNight = currentHour >= 0 && currentHour < 4;

  // 별똥별: 다크모드 + 자정(00:00:00~00:00:11)
  const [shootingStarsActive, setShootingStarsActive] = useState(false);
  const starsTriggeredRef = useRef(false);

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    if (!isDarkMode) {
      starsTriggeredRef.current = false;
      return;
    }
    const interval = setInterval(() => {
      const now = new Date();
      const isMidnightWindow =
        now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() < 12;

      if (isMidnightWindow && !starsTriggeredRef.current) {
        starsTriggeredRef.current = true;
        setShootingStarsActive(true);
        setTimeout(() => setShootingStarsActive(false), 5000);
      }
      if (!isMidnightWindow) {
        starsTriggeredRef.current = false;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isDarkMode]);

  const handleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('payday-view-mode', mode);
  };

  const handleProgressMode = (mode: ProgressMode) => {
    setProgressMode(mode);
    localStorage.setItem('payday-progress-mode', mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 flex flex-col items-center justify-center p-4">
      {/* 별똥별 이스터에그 */}
      <ShootingStars active={shootingStarsActive} />

      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            월급날 카운트다운 💰
          </h1>
          {settings.nickname && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {settings.nickname}님의 월급날
            </p>
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

      {/* 새벽 접속 배너 */}
      <AnimatePresence>
        {isLateNight && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-full max-w-md mb-3 px-4 py-2.5 rounded-2xl
              bg-indigo-950/80 dark:bg-indigo-900/60 backdrop-blur-sm
              border border-indigo-800/50 text-center"
          >
            <p className="text-sm text-indigo-200 font-medium">{lateNightMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-xl p-7"
      >
        {/* 동기부여 메시지 */}
        <p className="text-center text-sm font-medium text-purple-500 dark:text-purple-400 mb-4">
          {getMotivationalMessage(state.days)}
        </p>

        {/* 뷰 모드 토글 */}
        <div className="flex gap-2 justify-center mb-5">
          {(
            [
              { mode: 'countdown', label: '⏱ 카운트다운' },
              { mode: 'analog', label: '🍱 비유로 보기' },
            ] as const
          ).map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => handleViewMode(mode)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all
                ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 카운트다운 or 비유 뷰 */}
        <AnimatePresence mode="wait">
          {viewMode === 'countdown' ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.18 }}
            >
              <CountdownDisplay state={state} />
            </motion.div>
          ) : (
            <motion.div
              key="analog"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              <AnalogCountdown totalMs={state.totalMs} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 다음 월급날 */}
        <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-5">
          다음 월급날: {formatDate(state.nextPayday)}
        </p>

        {/* 진행도 모드 토글 */}
        <div className="mt-5 flex gap-1.5 justify-center">
          {(
            [
              { mode: 'default', label: '📊 급여 주기' },
              { mode: 'bank', label: '🏦 통장 게이지' },
            ] as const
          ).map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => handleProgressMode(mode)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all
                ${
                  progressMode === mode
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm scale-105'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 진행도 */}
        <div className="mt-3">
          <AnimatePresence mode="wait">
            {progressMode === 'default' ? (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <ProgressBar percent={state.progressPercent} />
              </motion.div>
            ) : (
              <motion.div
                key="bank"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <BankGauge progressPercent={state.progressPercent} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 수익 카운터 */}
        {(settings.elonMode || (settings.amount != null && settings.amount > 0)) && (
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
