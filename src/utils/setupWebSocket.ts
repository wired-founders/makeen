// src\utils\setupWebSocket.ts
export function setupWebSocket(url: string): WebSocket {
  const socket = new WebSocket(url);
  socket.binaryType = "arraybuffer";
  return socket;
}
