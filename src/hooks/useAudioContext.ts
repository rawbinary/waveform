import { createContext, useContext } from "react";

export const AudioPlayerContext = createContext<{
  ctx: AudioContext;
  analyser: AnalyserNode | undefined;
  playing: boolean;
}>({
  ctx: new AudioContext(),
  analyser: undefined,
  playing: false,
});

export const useAudioPlayerContext = () => {
  return useContext(AudioPlayerContext);
};
