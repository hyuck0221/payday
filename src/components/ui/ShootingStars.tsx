import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Star {
  id: number;
  startX: number;
  startY: number;
  length: number;
  duration: number;
  delay: number;
}

interface Props {
  active: boolean;
}

function createStars(): Star[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    startX: 5 + Math.random() * 70,
    startY: 2 + Math.random() * 50,
    length: 80 + Math.random() * 80,
    duration: 0.6 + Math.random() * 0.5,
    delay: i * 0.25 + Math.random() * 0.1,
  }));
}

export function ShootingStars({ active }: Props) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (!active) return;

    setStars(createStars());
    const timer = setTimeout(() => setStars([]), 6000);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <AnimatePresence>
      {stars.length > 0 && (
        <motion.div
          className="fixed inset-0 pointer-events-none overflow-hidden z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute"
              style={{
                left: `${star.startX}%`,
                top: `${star.startY}%`,
                width: star.length,
                height: 2,
                background: 'linear-gradient(90deg, transparent, #fff, #e2e8f0)',
                borderRadius: 2,
                rotate: '30deg',
                transformOrigin: 'left center',
              }}
              initial={{ opacity: 0, scaleX: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scaleX: [0, 1, 1, 0.2],
                x: star.length * Math.cos((30 * Math.PI) / 180),
                y: star.length * Math.sin((30 * Math.PI) / 180),
              }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
