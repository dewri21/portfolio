import { memo } from 'react';

interface KineticBackgroundProps {
  reducedMotion: boolean;
}

export const KineticBackground = memo(function KineticBackground({ reducedMotion }: KineticBackgroundProps): JSX.Element {
  if (reducedMotion) {
    return <div className="kinetic-bg" aria-hidden="true" />;
  }

  return (
    <div className="kinetic-bg" aria-hidden="true">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
    </div>
  );
});
