export type PayType = 'monthly' | 'weekly' | 'daily' | 'hourly';
export type HolidayRule = 'previous' | 'next' | 'none';
export type Theme = 'light' | 'dark' | 'system';

export interface Settings {
  payType: PayType;
  dayOfMonth: number;       // 1-31, monthly only
  dayOfWeek: number;        // 0-6 (Sun=0), weekly only
  hour: number;             // 0-23
  minute: number;           // 0-59
  holidayRule: HolidayRule;
  amount?: number;          // optional, not used when elonMode is true
  elonMode?: boolean;       // 일론 머스크 모드
  currency: string;
  nickname?: string;
  theme: Theme;
}

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  nextPayday: Date;
  prevPayday: Date;
  progressPercent: number;
  earned: number;
}
