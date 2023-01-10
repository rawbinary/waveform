import { createContext, useContext } from "react";

export const AudioPlayerContext = createContext<{
  analyser: AnalyserNode | undefined;
  playing: boolean;
}>({
  analyser: undefined,
  playing: false,
});

export const useAudioPlayerContext = () => {
  return useContext(AudioPlayerContext);
};
