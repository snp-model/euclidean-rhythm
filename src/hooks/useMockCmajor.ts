import { useState, useCallback, useEffect } from 'react';

// Mock connection interface
export interface CmajorPatchConnection {
  sendParameterValue: (name: string, value: number | boolean) => void;
  addEndpointListener: (endpoint: string, callback: (event: any) => void) => void;
  removeEndpointListener: (endpoint: string, callback: (event: any) => void) => void;
  connectDefaultAudioAndMIDI: (audioContext: AudioContext) => Promise<void>;
  close?: () => void;
}

export function useMockCmajor() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [patchConnection, setPatchConnection] = useState<CmajorPatchConnection | null>(null);

  const initAudio = useCallback(async () => {
    try {
      const ctx = new AudioContext(); // Real AudioContext for timing if needed, or just dummy
      
      // Mock Connection
      const mockConnection: CmajorPatchConnection = {
        sendParameterValue: (name, value) => {
        },
        addEndpointListener: (endpoint, callback) => {
          // Simulate heartbeat or step events if needed
          if (endpoint === 'currentStep') {
             // We could set up a Timer here to simulate steps
             const interval = setInterval(() => {
                const step = Math.floor(Date.now() / 250) % 16; 
                callback(step);
             }, 250);
             (mockConnection as any)._stepInterval = interval;
          }
        },
        removeEndpointListener: (endpoint, callback) => {
           if (endpoint === 'currentStep' && (mockConnection as any)._stepInterval) {
             clearInterval((mockConnection as any)._stepInterval);
           }
        },
        connectDefaultAudioAndMIDI: async (ctx) => {
        },
        close: () => {
        }
      };

      setAudioContext(ctx);
      setPatchConnection(mockConnection);
      setIsLoaded(true);
      
    } catch (err: any) {
      console.error("[MockCmajor] Init failed", err);
      setError(err.message);
    }
  }, []);

  return {
    isLoaded,
    error,
    audioContext,
    patchConnection,
    initAudio
  };
}
