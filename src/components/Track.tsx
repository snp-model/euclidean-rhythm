import { useMemo } from 'react';
import { euclidean } from '../utils/euclidean';
import type { TrackConfig } from '../types';
import './Track.css';
import { Knob } from './Knob';
import { Step } from './Step';

interface TrackProps {
  config: TrackConfig;
  currentStep: number;
  onConfigChange: (config: TrackConfig) => void;
}

export function Track({ config, currentStep, onConfigChange }: TrackProps) {
  const pattern = useMemo(() => {
    const p = euclidean(config.pulses, config.steps, config.rotation);
    return config.reversed ? [...p].reverse() : p;
  }, [config.pulses, config.steps, config.rotation, config.reversed]);

  const handlePulsesChange = (value: number) => {
    onConfigChange({ ...config, pulses: Math.max(0, Math.min(value, config.steps)) });
  };

  const handleRotationChange = (value: number) => {
    onConfigChange({ ...config, rotation: value });
  };

  const handleReverseToggle = () => {
    onConfigChange({ ...config, reversed: !config.reversed });
  };

  return (
    <div className="track">
      <div className="track-header">
        <div className="track-info">
          <span className="track-name">{config.name}</span>
          <button 
            className={`reverse-toggle mobile-only ${config.reversed ? 'active' : ''}`}
            onClick={handleReverseToggle}
            title="Reverse Pattern"
          >
            REVERSE
          </button>
        </div>
        <div className="track-controls">
          <Knob
            label="Pulses"
            value={config.pulses}
            min={0}
            max={config.steps}
            onChange={handlePulsesChange}
          />
          <Knob
            label="Rotation"
            value={config.rotation}
            min={0}
            max={config.steps - 1}
            onChange={handleRotationChange}
          />
          <button 
            className={`reverse-toggle desktop-only ${config.reversed ? 'active' : ''}`}
            onClick={handleReverseToggle}
            title="Reverse Pattern"
          >
            REVERSE
          </button>
        </div>
      </div>
      <div className="track-steps">
        {pattern.map((active, index) => (
          <Step
            key={index}
            active={!!active}
            isCurrent={index === currentStep}
          />
        ))}
      </div>
    </div>
  );
}

export default Track;
