import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Waveform Visualizer</h1>
      <div className="card"></div>
      <p className="read-the-docs">Select a file to visualize its waveform.</p>
    </div>
  );
}

export default App;
