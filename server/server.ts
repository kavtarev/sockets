import WebSocket, { WebSocketServer } from 'ws';
import { Chat } from './chat';
import { MessageParser } from './message-parser';

const chat = new Chat();

const server = new WebSocketServer({ port: 8080, host: 'server' });

server.on('connection', (socket: WebSocket) => {
  socket.on('open', () => {
    socket.send('hello');
  });

  socket.on('message', msg => {
    const text = msg.toString();
    const res = MessageParser.parse(text);

    if (!res) {
      socket.send('');
      socket.close();
      return;
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
