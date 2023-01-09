import { ChangeEvent } from "react";
import "./App.css";

function App() {
  if (!window.AudioContext) {
    return alert("You got a bad browser.");
  }

  const handleFileSelect = function (e: ChangeEvent<HTMLInputElement>) {
    const audioFile = e.target.files?.item(0);
    if (!audioFile) return alert("Not a valid file selected.");

    const audio = document.querySelector("#audio") as HTMLAudioElement;
    audio.src = URL.createObjectURL(audioFile);
    audio.play();
  };

  return (
    <div className="App">
      <h1>Waveform Visualizer</h1>
      <p>Select a file to visualize its waveform.</p>
      <div className="card">
        <input
          type="file"
          id="audioFile"
          onChange={(e) => handleFileSelect(e)}
          accept="audio/*"
        />
        <audio id="audio" controls />
      </div>
    </div>
  );
}

export default App;
