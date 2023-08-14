import { randomUUID } from 'crypto';
import WebSocket, { WebSocketServer } from 'ws';
import { Chat } from './src/chat';
import { MessageParser } from './src/message-parser';
import { ErrorHandler } from './src/error-handler';

const chat = new Chat();

const server = new WebSocketServer({ port: 8080, host: 'server' });

server.on('connection', (socket: WebSocket) => {
  socket.send(JSON.stringify({ id: randomUUID(), type: 'init' }));
  chat.emitRooms();

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

console.log('up on 8080');
