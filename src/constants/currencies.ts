export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'KRW', symbol: '₩', name: '한국 원' },
  { code: 'USD', symbol: '$', name: '미국 달러' },
  { code: 'EUR', symbol: '€', name: '유로' },
  { code: 'JPY', symbol: '¥', name: '일본 엔' },
  { code: 'GBP', symbol: '£', name: '영국 파운드' },
  { code: 'CNY', symbol: '¥', name: '중국 위안' },
];

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find(c => c.code === code)?.symbol ?? code;
}
