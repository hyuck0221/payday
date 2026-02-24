import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      title={copied ? '복사됨!' : 'URL 복사'}
      className="p-2 rounded-full text-gray-400 hover:text-purple-500 dark:text-slate-400
        dark:hover:text-purple-400 transition-colors"
    >
      {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
    </button>
  );
}
