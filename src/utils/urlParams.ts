import { Settings, PayType, HolidayRule, Theme } from '../types/settings';

const PAY_TYPE_MAP: Record<string, PayType> = {
  m: 'monthly',
  w: 'weekly',
  d: 'daily',
  h: 'hourly',
};
const PAY_TYPE_REV: Record<PayType, string> = {
  monthly: 'm',
  weekly: 'w',
  daily: 'd',
  hourly: 'h',
};
const HOLIDAY_MAP: Record<string, HolidayRule> = {
  p: 'previous',
  n: 'next',
  x: 'none',
};
const HOLIDAY_REV: Record<HolidayRule, string> = {
  previous: 'p',
  next: 'n',
  none: 'x',
};
const THEME_MAP: Record<string, Theme> = {
  l: 'light',
  d: 'dark',
  s: 'system',
};
const THEME_REV: Record<Theme, string> = {
  light: 'l',
  dark: 'd',
  system: 's',
};

export function encodeSettings(s: Settings): URLSearchParams {
  const p = new URLSearchParams();
  p.set('pt', PAY_TYPE_REV[s.payType]);
  if (s.payType === 'monthly') p.set('dm', String(s.dayOfMonth));
  if (s.payType === 'weekly') p.set('dw', String(s.dayOfWeek));
  if (s.payType !== 'hourly') {
    p.set('hr', String(s.hour));
    p.set('mn', String(s.minute));
  }
  p.set('hl', HOLIDAY_REV[s.holidayRule]);
  if (s.amount != null) p.set('am', String(s.amount));
  p.set('cu', s.currency);
  if (s.nickname) p.set('nk', s.nickname);
  p.set('th', THEME_REV[s.theme]);
  return p;
}

export function decodeSettings(search: string): Settings | null {
  try {
    const p = new URLSearchParams(search);
    const ptRaw = p.get('pt');
    if (!ptRaw || !(ptRaw in PAY_TYPE_MAP)) return null;
    const payType = PAY_TYPE_MAP[ptRaw];

    const hrRaw = p.get('hr');
    const mnRaw = p.get('mn');
    const hour = hrRaw != null ? parseInt(hrRaw, 10) : 18;
    const minute = mnRaw != null ? parseInt(mnRaw, 10) : 0;

    const hlRaw = p.get('hl') ?? 'p';
    const holidayRule: HolidayRule = HOLIDAY_MAP[hlRaw] ?? 'previous';

    const thRaw = p.get('th') ?? 's';
    const theme: Theme = THEME_MAP[thRaw] ?? 'system';

    const amRaw = p.get('am');
    const amount = amRaw ? parseFloat(amRaw) : undefined;
    const currency = p.get('cu') ?? 'KRW';
    const nickname = p.get('nk') ?? undefined;

    const dmRaw = p.get('dm');
    const dayOfMonth = dmRaw ? parseInt(dmRaw, 10) : 25;
    const dwRaw = p.get('dw');
    const dayOfWeek = dwRaw ? parseInt(dwRaw, 10) : 5;

    if (isNaN(hour) || isNaN(minute) || isNaN(dayOfMonth) || isNaN(dayOfWeek)) return null;

    return { payType, dayOfMonth, dayOfWeek, hour, minute, holidayRule, amount, currency, nickname, theme };
  } catch {
    return null;
  }
}

export function updateURL(settings: Settings): void {
  const p = encodeSettings(settings);
  const newURL = `${window.location.pathname}?${p.toString()}`;
  window.history.replaceState(null, '', newURL);
}
