import { WebSocket } from 'ws';
import { Message } from './types/zod';

export class Room {
  private sockets: WebSocket[] = [];

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  addSocket(socket: WebSocket) {
    this.sockets.push(socket);
  }

  removeSocket(socket: WebSocket) {
    const idx = this.sockets.findIndex(s => s === socket);

    if (idx === -1) {
      socket.send('sneaky pete');
      socket.close();
    }

    this.sockets.splice(idx, 1);
  }

  sendMessage(message: true | Message) {
    if (typeof message === 'boolean') {
      return true;
    }

    for (const socket of this.sockets) {
      socket.send(message.text);
    }
  }
}
