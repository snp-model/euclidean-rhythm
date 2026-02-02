import { useState, useCallback, useEffect } from 'react';
import Track from './Track';
import type { TrackConfig } from '../types';
import { euclidean, patternToBitmask } from '../utils/euclidean';
import './DrumMachine.css';

const DRUM_NAMES = [
  'Kick',
  'Snare',
  'HH Closed',
  'HH Open',
  'Clap',
  'Tom',
  'Rim',
  'Cowbell',
];

const DEFAULT_TRACKS: TrackConfig[] = DRUM_NAMES.map((name, id) => ({
  id,
  name,
  pulses: id === 0 ? 4 : id === 1 ? 2 : id === 2 ? 8 : 0,  // Default patterns
  steps: 16,
  rotation: 0,
  reversed: false,
}));

interface DrumMachineProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patchConnection?: any;  // Cmajor patch connection
}

export function DrumMachine({ patchConnection }: DrumMachineProps) {
  const [tracks, setTracks] = useState<TrackConfig[]>(DEFAULT_TRACKS);
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [globalSteps, setGlobalSteps] = useState(16);
  const [currentStep, setCurrentStep] = useState(-1);

  // Send pattern updates to Cmajor
  useEffect(() => {
    if (!patchConnection) return;

    tracks.forEach((track, index) => {
      const pattern = euclidean(track.pulses, track.steps, track.rotation);
      const bitmask = patternToBitmask(pattern);
      if (typeof patchConnection.sendEventOrValue === 'function') {
        patchConnection.sendEventOrValue(`pattern${index}`, bitmask);
      }
    });
  }, [tracks, patchConnection]);

  // Send tempo to Cmajor
  useEffect(() => {
    if (!patchConnection) return;
    if (typeof patchConnection.sendEventOrValue === 'function') {
      patchConnection.sendEventOrValue('tempo', tempo);
    }
  }, [tempo, patchConnection]);

  // Send play/stop to Cmajor
  useEffect(() => {
    if (!patchConnection) return;
    if (typeof patchConnection.sendEventOrValue === 'function') {
      patchConnection.sendEventOrValue('playing', playing);
    }
  }, [playing, patchConnection]);

  // Send global steps to Cmajor
  useEffect(() => {
    if (!patchConnection) return;
    if (typeof patchConnection.sendEventOrValue === 'function') {
      patchConnection.sendEventOrValue('steps', globalSteps);
    }
  }, [globalSteps, patchConnection]);

  // Listen for currentStep events from Cmajor
  useEffect(() => {
    if (!patchConnection) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEvent = (event: any) => {
      if (event.type === 'currentStep') {
        setCurrentStep(event.value);
      }
    };

    if (typeof patchConnection.addEndpointListener === 'function') {
      patchConnection.addEndpointListener('currentStep', handleEvent);
    }
    
    return () => {
      if (typeof patchConnection.removeEndpointListener === 'function') {
        patchConnection.removeEndpointListener('currentStep', handleEvent);
      }
    };
  }, [patchConnection]);

  const handleTrackChange = useCallback((updatedConfig: TrackConfig) => {
    setTracks((prev) =>
      prev.map((track) => (track.id === updatedConfig.id ? updatedConfig : track))
    );
  }, []);

  const handlePlayPause = () => {
    setPlaying((prev) => !prev);
  };

  const handleGlobalStepsChange = (newSteps: number) => {
    const clampedSteps = Math.max(1, Math.min(newSteps, 16));
    setGlobalSteps(clampedSteps);
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        steps: clampedSteps,
        pulses: Math.min(track.pulses, clampedSteps),
      }))
    );
  };

  return (
    <div className="drum-machine">
      <header className="drum-machine-header">
        <h1>Euclidean Drum Machine</h1>
        <div className="global-controls">
          <button
            className={`play-button ${playing ? 'playing' : ''}`}
            onClick={handlePlayPause}
          >
            {playing ? '⏹ Stop' : '▶ Play'}
          </button>
          <label className="tempo-control">
            Tempo:
            <input
              type="range"
              min="40"
              max="300"
              value={tempo}
              onChange={(e) => setTempo(parseInt(e.target.value))}
            />
            <span>{tempo} BPM</span>
          </label>
          <label className="steps-control">
            Steps:
            <input
              type="number"
              min="1"
              max="16"
              value={globalSteps}
              onChange={(e) => handleGlobalStepsChange(parseInt(e.target.value) || 1)}
            />
          </label>
        </div>
      </header>

      <div className="tracks-container">
        {tracks.map((track) => (
          <Track
            key={track.id}
            config={track}
            currentStep={currentStep}
            onConfigChange={handleTrackChange}
          />
        ))}
      </div>

      {!patchConnection && (
        <div className="loading-overlay">
          <p>Loading Cmajor audio engine...</p>
        </div>
      )}
    </div>
  );
}

export default DrumMachine;
