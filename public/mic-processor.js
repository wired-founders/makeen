class MicProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._inputSampleRate = sampleRate;
    this._targetSampleRate = 16000;
    this._resampleRatio = this._inputSampleRate / this._targetSampleRate;
    this._buffer = [];
    this._frameCount = 0;
  }

  downsampleAndConvert(buffer) {
    const newLength = Math.floor(buffer.length / this._resampleRatio);
    const downsampled = new Int16Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const index = Math.floor(i * this._resampleRatio);
      const sample = Math.max(-1, Math.min(1, buffer[index]));
      downsampled[i] = sample * 0x7fff;
    }

    return downsampled;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    const channelData = input[0];

    // Calculate metrics for logging only
    const rms =
      Math.sqrt(
        channelData.reduce((sum, x) => sum + x * x, 0) / channelData.length
      ) || 0;

    // Send ALL audio - no VAD filtering
    this._buffer.push(...channelData);

    const required = this._resampleRatio * 512;
    if (this._buffer.length >= required) {
      const chunk = this._buffer.splice(0, required);
      const int16 = this.downsampleAndConvert(chunk);

      // Log less frequently
      if (this._frameCount % 20 === 0) {
        //  console.log("🎤 [MicProcessor] RMS:", rms.toFixed(4), "Sent:", int16.length, "samples");
      }
      this._frameCount++;

      this.port.postMessage({
        audio: int16.buffer,
        rms: rms.toFixed(4),
      });
    }

    return true;
  }
}

registerProcessor("mic-processor", MicProcessor);
