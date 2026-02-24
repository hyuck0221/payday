import { PayType } from '../types/settings';

export const ELON_MONTHLY: Record<string, number> = {
  KRW: 9_600_000_000_000,
  USD: 7_085_000_000,
  EUR: 6_500_000_000,
  JPY: 1_050_000_000_000,
  GBP: 5_600_000_000,
  CNY: 51_000_000_000,
};

export function getElonAmount(currency: string, payType: PayType): number {
  const monthly = ELON_MONTHLY[currency] ?? ELON_MONTHLY['USD'];
  switch (payType) {
    case 'monthly': return monthly;
    case 'weekly':  return Math.floor(monthly / 4);
    case 'daily':   return Math.floor(monthly / 31);
    case 'hourly':  return Math.floor(monthly / 31 / 24);
  }
}
