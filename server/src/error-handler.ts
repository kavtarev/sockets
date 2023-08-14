import { WebSocket } from 'ws';

export function ErrorHandler(socket: WebSocket, text?: string) {
  socket.send(JSON.stringify({ type: 'error', text: text || 'some error occurred' }));
  socket.close();
}
