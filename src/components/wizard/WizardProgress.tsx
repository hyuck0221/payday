interface WizardProgressProps {
  current: number;
  total: number;
}

export function WizardProgress({ current, total }: WizardProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? 'w-8 h-3 bg-gradient-to-r from-pink-400 to-purple-500'
              : i < current
              ? 'w-3 h-3 bg-pink-300'
              : 'w-3 h-3 bg-gray-200 dark:bg-slate-600'
          }`}
        />
      ))}
    </div>
  );
}
