// src\utils\playBase64Audio.ts

export function playBase64Audio(
  base64Data: string,
  audioRef: HTMLAudioElement | null
) {
  try {
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const audioBlob = new Blob([bytes], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);

    if (audioRef) {
      audioRef.src = audioUrl;
      audioRef.play().catch((err) => {
        console.error("❌ Audio play failed:", err);
      });

      audioRef.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  } catch (err) {
    console.error("❌ Base64 audio processing failed:", err);
  }
}
