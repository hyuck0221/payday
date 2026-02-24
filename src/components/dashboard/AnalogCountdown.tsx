import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AnalogUnit,
  ANALOG_UNIT_ORDER,
  getAnalogCount,
  getUnitConfig,
} from '../../utils/analogUnits';

interface Props {
  totalMs: number;
}

export function AnalogCountdown({ totalMs }: Props) {
  const [activeUnit, setActiveUnit] = useState<AnalogUnit>('meal');
  const config = getUnitConfig(activeUnit);
  const count = getAnalogCount(totalMs, activeUnit);

  return (
    <div className="w-full">
      {/* 단위 탭 */}
      <div className="flex gap-1.5 justify-center mb-5 flex-wrap">
        {ANALOG_UNIT_ORDER.map((unit) => {
          const cfg = getUnitConfig(unit);
          return (
            <button
              key={unit}
              onClick={() => setActiveUnit(unit)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                ${
                  activeUnit === unit
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
            >
              {cfg.emoji} {cfg.label}
            </button>
          );
        })}
      </div>

      {/* 숫자 표시 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeUnit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-black text-transparent bg-clip-text
              bg-gradient-to-br from-pink-500 to-purple-600">
              {count.toLocaleString()}
            </span>
            <span className="text-lg font-bold text-gray-500 dark:text-slate-400">
              {config.counter}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            {config.emoji} {config.description} 아직{' '}
            <span className="font-bold text-purple-500">
              {count.toLocaleString()}
              {config.counter}
            </span>{' '}
            남았어요
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
