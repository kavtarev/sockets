import WebSocket, { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import { Chat } from './chat';
import { MessageParser } from './message-parser';
import { ErrorHandler } from './error-handler';

const chat = new Chat();

const server = new WebSocketServer({ port: 8080, host: 'server' });

server.on('connection', (socket: WebSocket) => {
  socket.send(JSON.stringify({ id: randomUUID(), type: 'init' }));

  socket.on('message', msg => {
    const text = msg.toString();
    const res = MessageParser.parse(text);

    if (!res) {
      return ErrorHandler(socket);
    }

    chat.processMessage({ ...res, socket });
  });

  socket.on('error', e => {
    console.log('socket-error', e);
  });
});

server.on('error', e => {
  console.log('socket error', e);
});

console.log('up in 8080');
