import { useEffect, useRef } from "react";
import useSize from "../hooks/useSize";
import { useAudioPlayerContext } from "../hooks/useAudioContext";

export default function WaveForm({ style }: WaveFormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, height] = useSize();

  const { playing, analyser } = useAudioPlayerContext();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!playing || !canvas || !analyser) return;

    analyser.fftSize = 2048;
    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      requestAnimationFrame(animate);

      canvas.width = canvas.width;
      canvasCtx.translate(0, canvas.offsetHeight / 2 - 75); // Set Y = 0 to be in the middle of the canvas
      animation(style)(analyser, canvas, canvasCtx, dataArray, bufferLength);
    };

    animate();
  }, [playing, style]);

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
  // analyser: AnalyserNode | undefined;
  style: string;
};

const animation = (type: string) => {
  switch (type) {
    case "sine":
      return animateSine;
    case "bars":
      return animateBars;
    default:
      return animateSine;
  }
};

function animateSine(
  analyser: AnalyserNode,
  canvas: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  dataArray: Uint8Array,
  bufferLength: number
) {
  // dataArray
  analyser.getByteTimeDomainData(dataArray);

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
}

function animateBars(
  analyser: AnalyserNode,
  canvas: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  dataArray: Uint8Array,
  bufferLength: number
) {
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = "#000";

  const HEIGHT = canvas.height / 2;

  var barWidth = Math.ceil(canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  for (var i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] / 255) * HEIGHT;

    var r = barHeight + 25 * (i / bufferLength);
    var g = HEIGHT * (i / bufferLength);
    var b = 50;

    canvasCtx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + 1;
    // console.log(barHeight);
  }
}
