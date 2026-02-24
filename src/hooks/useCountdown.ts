import { useState, useEffect } from 'react';
import { Settings } from '../types/settings';
import { CountdownState } from '../types/settings';
import { getNextPayday, getPrevPayday } from '../utils/paydayCalculator';
import { calculateEarned } from '../utils/earnings';

function computeState(settings: Settings): CountdownState {
  const now = new Date();
  const nextPayday = getNextPayday(settings, now);
  const prevPayday = getPrevPayday(settings, nextPayday);

  const totalMs = nextPayday.getTime() - now.getTime();
  const periodMs = nextPayday.getTime() - prevPayday.getTime();
  const elapsedMs = now.getTime() - prevPayday.getTime();
  const progressPercent = periodMs > 0 ? Math.min(100, (elapsedMs / periodMs) * 100) : 0;

  const totalSec = Math.max(0, Math.floor(totalMs / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const earned = settings.amount
    ? calculateEarned(settings.amount, now, prevPayday, nextPayday)
    : 0;

  return { days, hours, minutes, seconds, totalMs, nextPayday, prevPayday, progressPercent, earned };
}

export function useCountdown(settings: Settings | null): CountdownState | null {
  const [state, setState] = useState<CountdownState | null>(() => {
    return settings ? computeState(settings) : null;
  });

  useEffect(() => {
    if (!settings) {
      setState(null);
      return;
    }
    setState(computeState(settings));

    const id = setInterval(() => {
      setState(computeState(settings));
    }, 1000);

    return () => clearInterval(id);
  }, [settings]);

  return state;
}
