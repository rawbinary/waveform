import { useEffect, useRef } from "react";
import useSize from "../hooks/useSize";

export default function WaveForm({ analyser }: WaveFormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, height] = useSize();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!analyser) return;

    analyser.fftSize = 4096;
    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    const animate = () => {
      requestAnimationFrame(animate);

      analyser.getByteTimeDomainData(dataArray);
      // analyser.getByteFrequencyData(dataArray);
      canvas.width = canvas.width;
      canvasCtx.translate(0, canvas.offsetHeight / 2); // Set Y = 0 to be in the middle of the canvas
      canvasCtx.lineWidth = 3;
      canvasCtx.strokeStyle = "#aaa";

      canvasCtx.beginPath();

      const sliceWidth = Math.ceil(canvas.width / bufferLength);
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255;
        const y = (v * canvas.offsetHeight) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.offsetHeight / 2);
      canvasCtx.stroke();
    };

    animate();
  }, [analyser]);

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
  analyser: AnalyserNode | undefined;
};
