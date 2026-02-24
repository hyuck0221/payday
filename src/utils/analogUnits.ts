export type AnalogUnit = 'meal' | 'coffee' | 'commute' | 'sleep';

interface UnitConfig {
  hoursPerUnit: number;
  label: string;
  emoji: string;
  counter: string; // 단위 표현 (끼, 잔, 번...)
  description: string;
}

const UNITS: Record<AnalogUnit, UnitConfig> = {
  meal: {
    hoursPerUnit: 8,
    label: '식사',
    emoji: '🍱',
    counter: '끼',
    description: '밥을 먹을 일이',
  },
  coffee: {
    hoursPerUnit: 6,
    label: '커피',
    emoji: '☕',
    counter: '잔',
    description: '커피를 마실 일이',
  },
  commute: {
    hoursPerUnit: 12,
    label: '지옥철',
    emoji: '🚇',
    counter: '번',
    description: '지하철을 탈 일이',
  },
  sleep: {
    hoursPerUnit: 24,
    label: '수면',
    emoji: '😴',
    counter: '번',
    description: '잠을 잘 일이',
  },
};

export function getAnalogCount(totalMs: number, unit: AnalogUnit): number {
  const hours = totalMs / (1000 * 3600);
  return Math.max(0, Math.ceil(hours / UNITS[unit].hoursPerUnit));
}

export function getUnitConfig(unit: AnalogUnit): UnitConfig {
  return UNITS[unit];
}

export const ANALOG_UNIT_ORDER: AnalogUnit[] = ['meal', 'coffee', 'commute', 'sleep'];
