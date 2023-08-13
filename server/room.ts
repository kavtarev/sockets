import { WebSocket } from 'ws';
import { Message } from './types/zod-types';
import { RoomSocketType } from './types/room';
import { ErrorHandler } from './error-handler';

export class Room {
  private sockets: RoomSocketType[] = [];

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  addSocket(props: RoomSocketType) {
    this.sockets.push(props);
  }

  removeSocket(socket: WebSocket) {
    const idx = this.sockets.findIndex(s => s.socket === socket);

    if (idx === -1) {
      return ErrorHandler(socket);
    }

    this.sockets.splice(idx, 1);
  }

  sendMessage({ message, socket }: { message: true | Message; socket: WebSocket }) {
    if (typeof message !== 'boolean') {
      if (message.isPrivate) {
        this.sendPrivateMessage({ message, socket });
      } else {
        for (const s of this.sockets) {
          s.socket.send(JSON.stringify({ text: message.text, type: 'message' }));
        }
      }
    }
    return true;
  }

  private sendPrivateMessage({ message, socket }: { message: Message; socket: WebSocket }) {
    const receiver = this.sockets.find(s => s.id === message.to);

    if (!receiver) {
      return;
    }

    socket.send(JSON.stringify({ text: message.text, type: 'message' }));
    receiver.socket.send(JSON.stringify({ text: message.text, type: 'message' }));
  }
}
