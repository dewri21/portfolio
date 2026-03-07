import { animate, useMotionValue, useTransform, motion } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
  description: string;
  reducedMotion: boolean;
}

export function AnimatedCounter({
  value,
  suffix,
  label,
  description,
  reducedMotion
}: AnimatedCounterProps): JSX.Element {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (reducedMotion) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, {
      duration: 1.1,
      ease: 'easeOut'
    });

    return () => controls.stop();
  }, [count, reducedMotion, value]);

  return (
    <motion.article
      className="metric-card"
      whileHover={reducedMotion ? undefined : { y: -4, rotateX: 2 }}
      transition={{ duration: 0.2 }}
    >
      <p className="metric-value" aria-label={`${label} ${value}${suffix ?? ''}`}>
        <motion.span>{rounded}</motion.span>
        {suffix ?? ''}
      </p>
      <p className="metric-label">{label}</p>
      <p className="metric-description">{description}</p>
    </motion.article>
  );
}
