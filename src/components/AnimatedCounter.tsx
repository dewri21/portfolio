import { useEffect, useState } from 'react';

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
  const [count, setCount] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setCount(value);
      return;
    }

    let startTime: number | null = null;
    const duration = 1100; // 1.1s
    let animationFrame: number;

    const easeOutStrk = (t: number) => 1 - Math.pow(1 - t, 3); // cubic easeOut

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        const easeProgress = easeOutStrk(progress / duration);
        setCount(Math.round(easeProgress * value));
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, reducedMotion]);

  return (
    <article className="metric-card">
      <p className="metric-value" aria-label={`${label} ${value}${suffix ?? ''}`}>
        <span>{count}</span>
        {suffix ?? ''}
      </p>
      <p className="metric-label">{label}</p>
      <p className="metric-description">{description}</p>
    </article>
  );
}
