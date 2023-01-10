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
    audioRef.current.play();

    setDuration(Math.floor(audioRef.current.duration));
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

    setPlaying(false);
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

  function doPlayPause(playing: boolean) {
    setPlaying(!playing);
    if (playing) return audioRef.current.pause();
    audioRef.current.play();
  }

  return (
    <>
      <AudioPlayerContext.Provider value={{ ctx, analyser, playing }}>
        <div className="fixed bottom-0 pt-3 px-5 w-full bg-stone-800 text-center shadow-lg">
          <h2 className="font-bold text-slate-400">
            {track ? track.title : "No audio selected."}
          </h2>
          <input
            style={{
              background: `linear-gradient(90deg, #777 ${
                (seek / duration) * 100
              }%, white ${(seek / duration) * 100}%)`,
            }}
            className="w-full mb-4 h-1 mt-4 rounded appearance-none bg-slate-500 cursor-pointer transition-all ease-linear"
            type="range"
            value={seek}
            step="1"
            min="0"
            max={duration}
            onChange={() => {}}
          />
          <div>
            <button
              className="mb-4"
              type="button"
              onClick={() => {
                doPlayPause(playing);
              }}
            >
              {playing ? Pause : Play}
            </button>
          </div>
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

const Play = (
  <svg
    width="25"
    height="25"
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.907 7.99997L1.75 2.10772V13.8922L11.907 7.99997ZM13.293 6.78197C13.5076 6.90481 13.6858 7.08214 13.8098 7.29602C13.9339 7.5099 13.9992 7.75275 13.9992 7.99997C13.9992 8.2472 13.9339 8.49004 13.8098 8.70392C13.6858 8.9178 13.5076 9.09514 13.293 9.21797L2.15775 15.679C1.24775 16.2075 0 15.6037 0 14.461V1.53897C0 0.396223 1.24775 -0.207528 2.15775 0.320972L13.293 6.78197Z"
      fill="white"
    />
  </svg>
);

const Pause = (
  <svg
    width="25"
    height="25"
    viewBox="0 0 10 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1.5 0.125C1.73206 0.125 1.95462 0.217187 2.11872 0.381282C2.28281 0.545376 2.375 0.767936 2.375 1V15C2.375 15.2321 2.28281 15.4546 2.11872 15.6187C1.95462 15.7828 1.73206 15.875 1.5 15.875C1.26794 15.875 1.04538 15.7828 0.881282 15.6187C0.717187 15.4546 0.625 15.2321 0.625 15V1C0.625 0.767936 0.717187 0.545376 0.881282 0.381282C1.04538 0.217187 1.26794 0.125 1.5 0.125V0.125ZM8.5 0.125C8.73206 0.125 8.95462 0.217187 9.11872 0.381282C9.28281 0.545376 9.375 0.767936 9.375 1V15C9.375 15.2321 9.28281 15.4546 9.11872 15.6187C8.95462 15.7828 8.73206 15.875 8.5 15.875C8.26794 15.875 8.04538 15.7828 7.88128 15.6187C7.71719 15.4546 7.625 15.2321 7.625 15V1C7.625 0.767936 7.71719 0.545376 7.88128 0.381282C8.04538 0.217187 8.26794 0.125 8.5 0.125V0.125Z"
      fill="white"
    />
  </svg>
);
