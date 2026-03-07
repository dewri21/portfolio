import { motion } from 'framer-motion';

interface KineticBackgroundProps {
  reducedMotion: boolean;
}

export function KineticBackground({ reducedMotion }: KineticBackgroundProps): JSX.Element {
  if (reducedMotion) {
    return <div className="kinetic-bg" aria-hidden="true" />;
  }

  return (
    <div className="kinetic-bg" aria-hidden="true">
      <motion.div
        className="orb orb-a"
        animate={{ x: [0, 24, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb orb-b"
        animate={{ x: [0, -18, 0], y: [0, 18, 0], scale: [1, 0.95, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb orb-c"
        animate={{ x: [0, 14, 0], y: [0, 16, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
