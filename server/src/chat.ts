import WebSocket from 'ws';
import { Room } from './room';
import { IEvents } from './types/events';
import { Message } from './types/zod-types';

export class Chat {
  private rooms: Room[] = [];

  processMessage({
    event,
    roomName,
    message,
    socket,
    id,
  }: {
    event: IEvents;
    roomName: string;
    message?: Message;
    socket: WebSocket;
    id: string;
  }) {
    if (event === 'create') {
      return this.createRoom(roomName);
    }

    if (event === 'join') {
      return this.joinRoom({ roomName, socket, id });
    }

    if (event === 'leave') {
      return this.leaveRoom(roomName, socket);
    }

    if (event === 'message') {
      return this.sendMessage({ roomName, message, socket });
    }
  }

  async emitRooms() {
    await fetch('http://client:3000/emit', {
      method: 'POST',
      body: JSON.stringify(this.rooms.map(r => r.name)),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async createRoom(name: string) {
    if (this.findRoom(name)) {
      return false;
    }

    this.rooms.push(new Room(name));

    await this.emitRooms();
    return true;
  }

  private joinRoom({ roomName, socket, id }: { roomName: string; socket: WebSocket; id: string }) {
    const room = this.findRoom(roomName);

    if (!room) {
      return false;
    }

    return room.addSocket({ id, socket });
  }

  private leaveRoom(name: string, socket: WebSocket) {
    const room = this.findRoom(name);

    if (!room) {
      return false;
    }

    return room.removeSocket(socket);
  }

  private sendMessage({
    roomName,
    message,
    socket,
  }: {
    roomName: string;
    message?: Message;
    socket: WebSocket;
  }) {
    const room = this.findRoom(roomName);

    if (!room || !message?.text) {
      return false;
    }

    return room.sendMessage({ message, socket });
  }

  findRoom(name: string) {
    return this.rooms.find(r => r.name === name);
  }
}
