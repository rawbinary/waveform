import { ChangeEvent, useState } from "react";
import WaveForm from "./components/WaveForm";

function App() {
  if (!window.AudioContext) {
    alert("You got a bad browser.");
    return <></>;
  }

  const [waveData, setWaveData] = useState<number[]>([0]);

  const handleFileSelect = async function (e: ChangeEvent<HTMLInputElement>) {
    const audioFile = e.target.files?.item(0);
    if (!audioFile) return alert("Not a valid file selected.");

    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(
      await audioFile.arrayBuffer()
    );
    setWaveData(generateWaveform(audioBuffer));

    // const audio = document.querySelector("#audio") as HTMLAudioElement;
    // audio.src = URL.createObjectURL(audioFile);
    // audio.load();
    // audio.play();
  };

  return (
    <div className="flex flex-col items-center mt-20 transition-all duration-100">
      <h1 className="text-6xl mb-5">Waveform Visualizer</h1>
      <h3 className="text-2xl mb-6 text-gray-400">
        Select a file to visualize its waveform.
      </h3>
      <div className="mt-5 mb-5">
        <label className="py-2 px-10 flex justify-center items-center  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
          <input
            type="file"
            style={{ display: "none" }}
            accept="audio/*"
            onChange={(e) => handleFileSelect(e)}
          />
          <svg
            width="20"
            height="20"
            fill="currentColor"
            className="mr-2"
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z"></path>
          </svg>
          Select Audio File
        </label>
      </div>
      <WaveForm data={waveData} />
      <audio loop id="audio"></audio>
    </div>
  );
}

export default App;

// Since there's too many data points, we filter the channel data by normalizing it to the mean of a fixed chunk size
function generateWaveform(audioBuffer: AudioBuffer) {
  const audioData = audioBuffer.getChannelData(0);
  const samples = 90;
  const chunkSize = Math.floor(audioData.length / samples);
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    let sum = 0;
    for (let j = 0; j < chunkSize; j++) {
      sum += Math.abs(audioData[chunkSize * i + j]);
    }
    filteredData.push(sum / chunkSize);
  }

  // normalizing it ot the max value
  let m = Math.pow(Math.max(...filteredData), -1);
  return filteredData.map((n) => n * m);
}
