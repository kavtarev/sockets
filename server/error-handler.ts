import { WebSocket } from 'ws';

export function ErrorHandler(socket: WebSocket) {
  socket.send(JSON.stringify({ type: 'error', text: 'some error occurred' }));
  socket.close();
}
