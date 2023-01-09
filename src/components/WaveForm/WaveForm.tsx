import { useEffect, useRef } from "react";

export default function WaveForm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("LOL");

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
  }, []);

  return (
    <div>
      <canvas className="" ref={canvasRef}></canvas>
    </div>
  );
}
