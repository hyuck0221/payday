import { useRef, useCallback } from 'react';

/**
 * 빠른 연타 감지 훅.
 * windowMs 안에 threshold번 이상 클릭 시 onTrigger 호출.
 */
export function useClickEasterEgg(threshold = 5, windowMs = 1500) {
  const timestamps = useRef<number[]>([]);

  return useCallback(
    (onTrigger: () => void) => {
      const now = Date.now();
      timestamps.current = timestamps.current.filter((t) => now - t < windowMs);
      timestamps.current.push(now);

      if (timestamps.current.length >= threshold) {
        timestamps.current = [];
        onTrigger();
      }
    },
    [threshold, windowMs],
  );
}
