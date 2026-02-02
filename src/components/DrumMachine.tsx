import { useState, useCallback, useEffect } from 'react';
import { Knob } from './Knob';
import Track from './Track';
import type { TrackConfig } from '../types';
import { euclidean, patternToBitmask } from '../utils/euclidean';
import { RHYTHM_PRESETS } from '../constants/presets';
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
  const [kitIndex, setKitIndex] = useState(0);

  // Send pattern updates to Cmajor
  useEffect(() => {
    if (!patchConnection) return;

    tracks.forEach((track, index) => {
      let pattern = euclidean(track.pulses, track.steps, track.rotation);
      if (track.reversed) {
        pattern = pattern.reverse();
      }
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

  // Send kit index to Cmajor
  useEffect(() => {
    if (!patchConnection) return;
    if (typeof patchConnection.sendEventOrValue === 'function') {
      patchConnection.sendEventOrValue('kitIndex', kitIndex);
    }
  }, [kitIndex, patchConnection]);

  // Listen for currentStep events from Cmajor
  useEffect(() => {
    if (!patchConnection) return;

    // The listener callback receives the value directly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEvent = (value: any) => {
      setCurrentStep(value);
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
    const clampedSteps = Math.max(1, Math.min(newSteps, 32));
    setGlobalSteps(clampedSteps);
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        steps: clampedSteps,
        pulses: Math.min(track.pulses, clampedSteps),
      }))
    );
  };

  const handlePresetChange = (presetId: string) => {
    const preset = RHYTHM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    // Update global steps if different
    if (globalSteps !== preset.steps) {
      setGlobalSteps(preset.steps);
    }

    // Update tracks with preset values or defaults
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        const trackPreset = preset.tracks.find((t) => t.id === track.id);
        if (trackPreset) {
          return {
            ...track,
            steps: preset.steps,
            pulses: trackPreset.pulses,
            rotation: trackPreset.rotation,
            reversed: false,
          };
        }
        // Reset other tracks to silence/default, but keep basic config
        return {
          ...track,
          steps: preset.steps,
          pulses: 0,
          rotation: 0,
          reversed: false,
        };
      })
    );
  };

  return (
    <div className="drum-machine">
      <header className="drum-machine-header">
        <h1>Euclidean Drum Machine</h1>
        <div className="global-controls">
          <div className="control-group secondary-controls">
            <div className="kit-control">
              <span className="control-label">Kit</span>
              <div className="kit-buttons">
                <button
                  className={`kit-button ${kitIndex === 0 ? 'active' : ''}`}
                  onClick={() => setKitIndex(0)}
                >
                  Standard
                </button>
                <button
                  className={`kit-button ${kitIndex === 1 ? 'active' : ''}`}
                  onClick={() => setKitIndex(1)}
                >
                  Techno
                </button>
              </div>
            </div>
            <div className="preset-control">
              <span className="control-label">PRESET</span>
              <select
                className="preset-select"
                onChange={(e) => handlePresetChange(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select Preset</option>
                {RHYTHM_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="control-group primary-controls">
            <button
              className={`play-button ${playing ? 'playing' : ''}`}
              onClick={handlePlayPause}
            >
              {playing ? '⏹ Stop' : '▶ Play'}
            </button>
            <label className="tempo-control">
              Tempo
              <input
                type="range"
                min="40"
                max="300"
                value={tempo}
                onChange={(e) => setTempo(parseInt(e.target.value))}
              />
              <span>{tempo} BPM</span>
            </label>
            <Knob
              label="Steps"
              value={globalSteps}
              min={1}
              max={32}
              onChange={handleGlobalStepsChange}
            />
          </div>
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
