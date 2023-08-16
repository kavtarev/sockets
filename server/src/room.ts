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

  isIn(socket: WebSocket) {
    return this.sockets.some(s => s.socket === socket);
  }

  addSocket(props: RoomSocketType) {
    this.sockets.push(props);
  }

  removeSocket(socket: WebSocket) {
    const idx = this.sockets.findIndex(s => s.socket === socket);

    if (idx === -1) {
      return ErrorHandler(socket, 'in remove');
    }

    this.sockets.splice(idx, 1);
  }

  sendMessage({ message, socket, id }: { message: true | Message; socket: WebSocket; id: string }) {
    if (typeof message === 'boolean') {
      return;
    }

    if (message.isPrivate) {
      this.sendPrivateMessage({ message, socket, id });
    } else {
      for (const s of this.sockets) {
        s.socket.send(
          JSON.stringify({
            text: message.text,
            type: message.type,
            event: 'message',
            sender: { id },
          }),
        );
      }
    }

    return true;
  }

  private sendPrivateMessage({
    message,
    socket,
    id,
  }: {
    message: Message;
    socket: WebSocket;
    id: string;
  }) {
    const receiver = this.sockets.find(s => s.id === message.to);

    if (!receiver) {
      return;
    }

    socket.send(JSON.stringify({ text: message.text, type: message.type, sender: { id } }));
    receiver.socket.send(
      JSON.stringify({ text: message.text, type: message.type, sender: { id } }),
    );
  }
}
