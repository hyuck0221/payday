import { Sun, Moon, Monitor } from 'lucide-react';
import { Theme } from '../../types/settings';

interface Props {
  theme: Theme;
  onToggle: (t: Theme) => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const cycle = (): Theme => {
    if (theme === 'light') return 'dark';
    if (theme === 'dark') return 'system';
    return 'light';
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <button
      onClick={() => onToggle(cycle())}
      title="테마 변경"
      className="p-2 rounded-full text-gray-400 hover:text-purple-500 dark:text-slate-400
        dark:hover:text-purple-400 transition-colors"
    >
      <Icon size={18} />
    </button>
  );
}
