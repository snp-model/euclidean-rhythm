import { useMemo } from 'react';
import { euclidean } from '../utils/euclidean';
import './Track.css';

import type { TrackConfig } from '../types';

// export interface TrackConfig removed


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
        <span className="track-name">{config.name}</span>
        <div className="track-controls">
          <label>
            Pulses:
            <input
              type="number"
              min="0"
              max={config.steps}
              value={config.pulses}
              onChange={(e) => handlePulsesChange(parseInt(e.target.value) || 0)}
            />
          </label>
          <label>
            Rotation:
            <input
              type="number"
              min="0"
              max={config.steps - 1}
              value={config.rotation}
              onChange={(e) => handleRotationChange(parseInt(e.target.value) || 0)}
            />
          </label>
          <button 
            className={`reverse-toggle ${config.reversed ? 'active' : ''}`}
            onClick={handleReverseToggle}
            title="Reverse Pattern"
          >
            Reverse
          </button>
        </div>
      </div>
      <div className="track-steps">
        {pattern.map((active, index) => (
          <div
            key={index}
            className={`step ${active ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Track;
