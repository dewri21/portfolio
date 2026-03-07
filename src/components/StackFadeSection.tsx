import type { ReactNode } from 'react';

interface StackFadeSectionProps {
  id: string;
  className: string;
  testId: string;
  reducedMotion: boolean;
  children: ReactNode;
}

export function StackFadeSection({
  id,
  className,
  testId,
  children
}: StackFadeSectionProps): JSX.Element {
  return (
    <section id={id} className={className} data-testid={testId}>
      {children}
    </section>
  );
}
