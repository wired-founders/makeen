class MicProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const channelData = input[0];
    const rms =
      Math.sqrt(
        channelData.reduce((sum, x) => sum + x * x, 0) / channelData.length
      ) || 0;
    if (rms > 0.02) {
      this.port.postMessage({ audio: channelData, rms });
    }
    return true;
  }
}
registerProcessor("mic-processor", MicProcessor);
