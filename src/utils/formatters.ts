import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getCurrencySymbol } from '../constants/currencies';

export function formatCurrency(amount: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode);
  if (currencyCode === 'KRW' || currencyCode === 'JPY') {
    return `${symbol}${Math.floor(amount).toLocaleString()}`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy년 M월 d일 (E) HH:mm', { locale: ko });
}

export function formatShortDate(date: Date): string {
  return format(date, 'M월 d일', { locale: ko });
}

export function getMotivationalMessage(days: number): string {
  if (days === 0) return '오늘이 월급날이에요! 🎉';
  if (days === 1) return '내일이 월급날! 조금만 더 힘내요 💪';
  if (days <= 3) return '거의 다 왔어요! 파이팅! 🔥';
  if (days <= 7) return '이번 주 안에 월급날이 와요 😊';
  if (days <= 14) return '반 정도 왔어요! 잘 하고 있어요 ⭐';
  if (days <= 21) return '조금씩 가까워지고 있어요 🌱';
  return '열심히 일하면 시간이 빠르게 가요 ✨';
}

export function getDayOfWeekLabel(dow: number): string {
  const labels = ['일', '월', '화', '수', '목', '금', '토'];
  return labels[dow] ?? '';
}
