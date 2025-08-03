// src\utils\playAudioChunk.ts
let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;

export async function playAudioChunk(
  chunk: ArrayBuffer,
  elementFromRef?: HTMLAudioElement
) {
  console.log("🔊 Received audio chunk:", chunk.byteLength, "bytes");

  try {
    // Initialize AudioContext once
    if (!audioContext) {
      audioContext = new AudioContext();
      gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      console.log("🎧 AudioContext initialized");
    }

    // Resume if suspended
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    // Decode and play
    const audioBuffer = await audioContext.decodeAudioData(chunk.slice(0));
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode!);
    source.start();

    console.log("▶️ Playing audio chunk");
  } catch (err) {
    console.error("❌ Audio playback failed:", err);

    // Fallback: Try blob URL method
    try {
      const blob = new Blob([chunk], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const audio = elementFromRef || new Audio();
      audio.src = url;
      await audio.play();
      console.log("▶️ Fallback playback started");
    } catch (fallbackErr) {
      console.error("❌ Fallback failed:", fallbackErr);
    }
  }
}

// Cleanup function
export function cleanupAudio() {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
    gainNode = null;
  }
}
