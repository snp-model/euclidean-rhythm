import { memo } from 'react';

interface StepProps {
  active: boolean;
  isCurrent: boolean;
}

export const Step = memo(function Step({ active, isCurrent }: StepProps) {
  return (
    <div
      className={`step ${active ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
    />
  );
});
