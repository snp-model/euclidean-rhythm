import { useState, useEffect, useCallback } from 'react';

interface CmajorPatchConnection {
  sendEventOrValue: (endpointID: string, value: any, rampFrames?: number) => void;
  addEndpointListener: (endpoint: string, callback: (event: any) => void) => void;
  removeEndpointListener: (endpoint: string, callback: (event: any) => void) => void;
  connectDefaultAudioAndMIDI: (audioContext: AudioContext) => Promise<void>;
  close?: () => void;
}

interface UseCmajorOptions {
  patchUrl?: string;
}

/**
 * Custom hook for managing Cmajor audio engine connection
 * Uses Vite aliases to import the Cmajor module directly, similar to basic-synthesizer project
 */
export function useCmajor(options: UseCmajorOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [patchConnection, setPatchConnection] = useState<CmajorPatchConnection | null>(null);

  // Initialize audio context and load Cmajor patch
  const initAudio = useCallback(async () => {
    if (audioContext && patchConnection) {
      return { audioContext, patchConnection };
    }

    try {
      setError(null);
      // Create audio context
      const ctx = new AudioContext();
      await ctx.suspend();

      // Dynamically import the compiled Cmajor patch
      // This maps to src/audio/dist/cmaj_Euclidean_Drum_Machine.js via vite.config.ts alias
      const patchModule = await import('@cmajor/patch');
      
      // Create the patch connection using AudioWorklet
      const connection = await patchModule.createAudioWorkletNodePatchConnection(
        ctx,
        'cmaj-worklet-processor'
      );

      // Connect to default audio output
      await connection.connectDefaultAudioAndMIDI(ctx);
      
      // Resume audio context
      await ctx.resume();

      setAudioContext(ctx);
      setPatchConnection(connection);
      setIsLoaded(true);

      return { audioContext: ctx, patchConnection: connection };
    } catch (error: any) {
      console.error('Failed to initialize Cmajor patch:', error);
      setError(error.message || 'Unknown error occurred during Cmajor initialization');
      throw error;
    }
  }, [audioContext, patchConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (patchConnection?.close) {
        patchConnection.close();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext, patchConnection]);

  return {
    isLoaded,
    error,
    audioContext,
    patchConnection,
    initAudio,
  };
}

export default useCmajor;
