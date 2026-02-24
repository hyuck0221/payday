import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, PayType, HolidayRule, Theme } from '../../types/settings';
import { WizardProgress } from './WizardProgress';
import { WizardNav } from './WizardNav';
import { Step1PayType } from './steps/Step1PayType';
import { Step2Payday } from './steps/Step2Payday';
import { Step3Holiday } from './steps/Step3Holiday';
import { Step4Amount } from './steps/Step4Amount';
import { Step5Other } from './steps/Step5Other';

const TOTAL_STEPS = 5;

const DEFAULT_SETTINGS: Settings = {
  payType: 'monthly',
  dayOfMonth: 25,
  dayOfWeek: 5,
  hour: 18,
  minute: 0,
  holidayRule: 'previous',
  amount: undefined,
  currency: 'KRW',
  nickname: undefined,
  theme: 'system',
};

interface Props {
  initialSettings?: Settings;
  onComplete: (settings: Settings) => void;
}

export function Wizard({ initialSettings, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [draft, setDraft] = useState<Settings>(initialSettings ?? DEFAULT_SETTINGS);

  const update = (partial: Partial<Settings>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  const canNext = (): boolean => {
    return true; // All steps have valid defaults
  };

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      onComplete(draft);
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Step1PayType
            value={draft.payType}
            onChange={(v: PayType) => update({ payType: v })}
          />
        );
      case 1:
        return (
          <Step2Payday
            payType={draft.payType}
            dayOfMonth={draft.dayOfMonth}
            dayOfWeek={draft.dayOfWeek}
            hour={draft.hour}
            minute={draft.minute}
            onChange={(u) => update(u)}
          />
        );
      case 2:
        return (
          <Step3Holiday
            value={draft.holidayRule}
            onChange={(v: HolidayRule) => update({ holidayRule: v })}
          />
        );
      case 3:
        return (
          <Step4Amount
            amount={draft.amount}
            currency={draft.currency}
            onChange={(amount) => update({ amount })}
          />
        );
      case 4:
        return (
          <Step5Other
            nickname={draft.nickname}
            currency={draft.currency}
            theme={draft.theme}
            onChange={(u: { nickname?: string; currency?: string; theme?: Theme }) => update(u)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            월급날 카운트다운
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
            몇 가지 정보만 알려주세요!
          </p>
        </div>

        <WizardProgress current={step} total={TOTAL_STEPS} />

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-xl p-7 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <WizardNav
            step={step}
            total={TOTAL_STEPS}
            canNext={canNext()}
            onPrev={goPrev}
            onNext={goNext}
            onSkip={step === 3 ? () => { update({ amount: undefined }); goNext(); } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
