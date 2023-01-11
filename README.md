# Waveform

Audio Waveform generator written in typescript. Generates **Sine Wave** on `TimeDomain` data and **Bars** on `Frequency` data using [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

**See Demo at: https://waveform.robin.md**

## Why?

Just to experiment around audio data and Web Audio API. Also, this has the custom audio progress bar and controls instead of the default provided by the browser, which gives provides the genral idea on customizing and building custom players.

**No any thirdparty library is used for any wave generation, everything is fully self-coded for the sake of understanding every aspects involved.**

## Web Audio API

The Web Audio API involves handling audio operations inside an audio context, and has been designed to allow modular routing. Basic audio operations are performed with audio nodes, which are linked together to form an audio routing graph. Several sources — with different types of channel layout — are supported even within a single context. This modular design provides the flexibility to create complex audio functions with dynamic effects.

## Wave Generation Workflow

Basically, the workflow involved in Wave Generation is something like:

### 1. Create `Audio Context`

```ts
const ctx = new AudioContext();
```

### 2. Inside context, create sources like `<audio>`

Source can be created from an `<audio>` HTML element or created on the fly.

```ts
const audio = new Audio();
// or,
const audio = document.querySelector("audio");

// Create media element source
const source = ctx.createMediaElementSource(audio);
```

### 3. Also, create analyser for analysing audio data.

```ts
const analyser = ctx.createAnalyser();
```

### 4. Then, connect up everything

Here, we connect source upto the analyser, then analyser upto the final destination of the `Audio Context`.

```ts
source.connect(analyser);
analyser.connect(ctx.destination);
```

### 5. Load and Play audio

```ts
audio.src =
  "your audio file, whether it be path or URL.createObjectURL(fileinput)";
audio.load();
audio.play();
```

### 6. Wave Generation

We get the TimeDomainData / FrequencyData which is the what we need that reflects the wave data and display it in the canvas. Canvas rendering hasn't been explained. See the source at `src/components/WaveForm.tsx` and functions `animateBars()` and `animateSine()` for canvas animation logic.

```ts
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// We use the ByteTimeDomainData for the sine wave
analyser.getByteTimeDomainData(dataArray);

// Or, ByteFrequencyData for the Bars (since bar better represents the frequency of the audio)
analyser.getByteFrequencyData(dataArray);
```

## Tools Used

- React for Web Interface of Demo App
- Vite for Build Tooling
- Typescript
- Tailwind for design system

## Getting Started

Setup

1. Clone repo
1. `npm install`
1. Run dev server `npm run dev`

## References

[Javascript Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
