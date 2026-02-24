import { addDays, subDays, getDay } from 'date-fns';
import { isHoliday } from '../constants/holidays';

export function isWeekend(date: Date): boolean {
  const dow = getDay(date);
  return dow === 0 || dow === 6;
}

export function isNonWorkingDay(date: Date): boolean {
  return isWeekend(date) || isHoliday(date);
}

export function getNextBusinessDay(date: Date): Date {
  let d = addDays(date, 1);
  while (isNonWorkingDay(d)) {
    d = addDays(d, 1);
  }
  return d;
}

export function getPreviousBusinessDay(date: Date): Date {
  let d = subDays(date, 1);
  while (isNonWorkingDay(d)) {
    d = subDays(d, 1);
  }
  return d;
}
