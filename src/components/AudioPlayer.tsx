import { useEffect, useRef, useState } from "react";
import {
  AudioPlayerContext,
  useAudioPlayerContext,
} from "../hooks/useAudioContext";
import WaveForm from "./WaveForm";

export default function AudioPlayer({ track, style }: AudioPlayerProps) {
  const { ctx } = useAudioPlayerContext();

  const [analyser, setAnalyser] = useState<AnalyserNode>(ctx.createAnalyser());

  const [playing, setPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const seekRef = useRef<number>();

  audioRef.current.onloadedmetadata = () => {
    // setting play states

    audioRef.current.play();
    console.log(audioRef.current.duration);
    setDuration(Math.ceil(audioRef.current.duration));
    setPlaying(true);

    startSeeking();
  };

  const startSeeking = () => {
    clearInterval(seekRef.current);

    seekRef.current = setInterval(() => {
      if (!audioRef.current.ended) setSeek(audioRef.current.currentTime);
    }, 1000);
  };

  useEffect(() => {
    if (!track) return;
    audioRef.current.pause();

    const audio = (audioRef.current = new Audio());

    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();

    source?.connect(analyser);
    analyser?.connect(ctx.destination);
    setAnalyser(analyser);

    audio.src = track.src;
    audio.load();
  }, [track]);

  return (
    <>
      <AudioPlayerContext.Provider value={{ ctx, analyser, playing }}>
        <div className="fixed bottom-0 pt-3 px-5 w-full bg-stone-800 text-center shadow-lg">
          <h2 className="font-thin">
            {track ? track.title : "No audio selected."}
          </h2>
          <input
            style={{
              background: `linear-gradient(90deg, #777 ${Math.ceil(
                (seek / duration) * 100
              )}%, white ${Math.ceil((seek / duration) * 100)}%)`,
            }}
            className="w-full mb-5 h-1 mt-1 rounded appearance-none bg-slate-500 cursor-pointer transition-all ease-linear"
            type="range"
            value={Math.floor(seek)}
            step="1"
            min="0"
            max={duration}
            onChange={() => {}}
          />
        </div>

        <WaveForm style={style} />
      </AudioPlayerContext.Provider>
    </>
  );
}

type AudioPlayerProps = {
  style: string;
  track:
    | {
        title: string;
        src: string;
      }
    | undefined;
};
