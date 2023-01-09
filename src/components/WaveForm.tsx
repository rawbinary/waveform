import { useEffect, useRef } from "react";
import useSize from "../hooks/useSize";

export default function WaveForm({ data }: WaveFormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, height] = useSize();

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext("2d");
    if (!ctx) return;

    //
  }, []);

  return (
    <>
      <canvas
        className="absolute top-0 left-0 -z-10"
        width={width}
        height={height}
        ref={canvasRef}
      ></canvas>
    </>
  );
}

type WaveFormProps = {
  data: number[];
};
