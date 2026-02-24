import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  earned: number;
  currency: string;
}

export function EarningsCounter({ earned, currency }: Props) {
  const spring = useSpring(earned, { stiffness: 50, damping: 20 });
  const displayed = useTransform(spring, (v) => formatCurrency(v, currency));
  const prevRef = useRef(earned);

  useEffect(() => {
    if (Math.abs(earned - prevRef.current) > 0.001) {
      spring.set(earned);
      prevRef.current = earned;
    }
  }, [earned, spring]);

  return (
    <div className="text-center">
      <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1 tracking-wider uppercase">
        지금까지 번 금액
      </p>
      <motion.p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        {displayed}
      </motion.p>
    </div>
  );
}
