import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface WizardNavProps {
  step: number;
  total: number;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSkip?: () => void;
}

export function WizardNav({ step, total, canNext, onPrev, onNext, onSkip }: WizardNavProps) {
  const isLast = step === total - 1;

  return (
    <div className="flex items-center justify-between mt-8">
      <button
        onClick={onPrev}
        disabled={step === 0}
        className="flex items-center gap-1 px-4 py-2 rounded-2xl text-sm font-medium
          text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
        이전
      </button>

      <div className="flex items-center gap-2">
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded-2xl text-sm font-medium text-gray-400
              dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
          >
            건너뛰기
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!canNext}
          className="flex items-center gap-1 px-6 py-2.5 rounded-2xl text-sm font-semibold
            bg-gradient-to-r from-pink-400 to-purple-500 text-white
            hover:from-pink-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed
            transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          {isLast ? (
            <>
              <Check size={16} />
              완료!
            </>
          ) : (
            <>
              다음
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
