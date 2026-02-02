/// <reference types="vite/client" />

declare module '@cmajor/patch' {
  const patch: {
    createAudioWorkletNodePatchConnection: (
      context: AudioContext,
      workletName: string
    ) => Promise<any>;
  };
  export = patch;
}
