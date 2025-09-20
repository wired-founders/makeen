// src\utils\playAudioChunk.ts
let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;
const MIN_AUDIO_SIZE = 400; // bytes
let chunkBuffer: Uint8Array[] = [];

export async function playAudioChunk(
  chunk: ArrayBuffer,
  elementFromRef?: HTMLAudioElement
) {
  console.log("🔊 Received audio chunk:", chunk.byteLength, "bytes");

  // DEBUG: Log chunk headers to identify format
  const header = new Uint8Array(chunk.slice(0, 16));
  const headerHex = Array.from(header)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
  const headerAscii = Array.from(header)
    .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "."))
    .join("");
  console.log("📋 Header (hex):", headerHex);
  console.log("📋 Header (ascii):", headerAscii);

  // Check for known audio signatures
  if (
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46
  ) {
    console.log("🎵 WAV format detected");
  } else if (header[0] === 0xff && (header[1] & 0xe0) === 0xe0) {
    console.log("🎵 MP3 format detected");
  } else if (
    header[0] === 0x4f &&
    header[1] === 0x67 &&
    header[2] === 0x67 &&
    header[3] === 0x53
  ) {
    console.log("🎵 OGG format detected");
  } else {
    console.log("❓ Unknown format - likely raw PCM");
  }

  // Skip tiny chunks that can't be valid audio
  if (chunk.byteLength < MIN_AUDIO_SIZE) {
    console.log("⏭️ Chunk too small, buffering...");
    chunkBuffer.push(new Uint8Array(chunk));

    // Try to combine buffered chunks
    const totalSize = chunkBuffer.reduce((sum, buf) => sum + buf.length, 0);
    if (totalSize >= MIN_AUDIO_SIZE) {
      const combined = new Uint8Array(totalSize);
      let offset = 0;
      for (const buf of chunkBuffer) {
        combined.set(buf, offset);
        offset += buf.length;
      }
      chunkBuffer = []; // Clear buffer
      return playAudioChunk(combined.buffer, elementFromRef);
    }
    return; // Wait for more chunks
  }

  // Detect audio format from header
  let mimeType = "audio/wav"; // default

  if (header[0] === 0xff && (header[1] & 0xe0) === 0xe0) {
    mimeType = "audio/mpeg"; // MP3
  } else if (header[0] === 0x4f && header[1] === 0x67) {
    mimeType = "audio/ogg"; // OGG
  }

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

    // Improved fallback with correct MIME type
    try {
      const blob = new Blob([chunk], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const audio = elementFromRef || new Audio();
      audio.src = url;
      await audio.play();
      console.log("▶️ Fallback playback started");

      // Cleanup URL after use
      audio.onended = () => URL.revokeObjectURL(url);
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
  chunkBuffer = []; // Clear any buffered chunks
}
