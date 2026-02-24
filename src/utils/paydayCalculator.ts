import {
  setDate,
  setDay,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  addMonths,
  addWeeks,
  addDays,
  addHours,
  isBefore,
  getDaysInMonth,
  startOfHour,
} from 'date-fns';
import { Settings } from '../types/settings';
import { isNonWorkingDay, getNextBusinessDay, getPreviousBusinessDay } from './holidayChecker';

function clampToEndOfMonth(date: Date): Date {
  const maxDay = getDaysInMonth(date);
  if (date.getDate() > maxDay) {
    return setDate(date, maxDay);
  }
  return date;
}

function setTime(date: Date, hour: number, minute: number): Date {
  return setMilliseconds(setSeconds(setMinutes(setHours(date, hour), minute), 0), 0);
}

export function getRawPayday(settings: Settings, now: Date): Date {
  const { payType, dayOfMonth, dayOfWeek, hour, minute } = settings;

  switch (payType) {
    case 'monthly': {
      let candidate = setTime(setDate(now, dayOfMonth), hour, minute);
      candidate = clampToEndOfMonth(candidate);
      if (!isBefore(now, candidate)) {
        candidate = addMonths(candidate, 1);
        candidate = clampToEndOfMonth(setDate(candidate, dayOfMonth));
        candidate = setTime(candidate, hour, minute);
      }
      return candidate;
    }
    case 'weekly': {
      let candidate = setTime(setDay(now, dayOfWeek, { weekStartsOn: 0 }), hour, minute);
      if (!isBefore(now, candidate)) {
        candidate = addWeeks(candidate, 1);
      }
      return candidate;
    }
    case 'daily': {
      let candidate = setTime(now, hour, minute);
      if (!isBefore(now, candidate)) {
        candidate = addDays(candidate, 1);
      }
      return candidate;
    }
    case 'hourly': {
      const next = addHours(startOfHour(now), 1);
      return next;
    }
  }
}

export function adjustForHoliday(rawDate: Date, rule: Settings['holidayRule']): Date {
  if (rule === 'none') return rawDate;

  let adjusted = rawDate;
  let iter = 0;
  while (isNonWorkingDay(adjusted) && iter < 14) {
    if (rule === 'previous') {
      adjusted = getPreviousBusinessDay(adjusted);
    } else {
      adjusted = getNextBusinessDay(adjusted);
    }
    iter++;
  }
  return adjusted;
}

export function getNextPayday(settings: Settings, now: Date): Date {
  const raw = getRawPayday(settings, now);
  return adjustForHoliday(raw, settings.holidayRule);
}

export function getPrevPayday(settings: Settings, nextPayday: Date): Date {
  const { payType, dayOfMonth, hour, minute } = settings;
  const oneBefore = (() => {
    switch (payType) {
      case 'monthly': {
        const prev = addMonths(nextPayday, -1);
        const clamped = clampToEndOfMonth(setDate(prev, dayOfMonth));
        return setTime(clamped, hour, minute);
      }
      case 'weekly':
        return addWeeks(nextPayday, -1);
      case 'daily':
        return addDays(nextPayday, -1);
      case 'hourly':
        return addHours(nextPayday, -1);
    }
  })();
  return adjustForHoliday(oneBefore, settings.holidayRule);
}
