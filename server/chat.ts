import WebSocket from 'ws';
import { Room } from './room';
import { IEvents } from './types/events';
import { Message } from './types/zod';

export class Chat {
  private rooms: Room[] = [];

  processMessage({
    event,
    roomName,
    message,
    socket,
  }: {
    event: IEvents;
    roomName: string;
    message?: Message;
    socket: WebSocket;
  }) {
    if (event === 'create') {
      return this.createRoom(roomName);
    }

    if (event === 'join') {
      return this.joinRoom(roomName, socket);
    }

    if (event === 'leave') {
      return this.leaveRoom(roomName, socket);
    }

    if (event === 'message') {
      return this.sendMessage(roomName, message);
    }
  }

  private createRoom(name: string) {
    if (this.findRoom(name)) {
      return false;
    }

    this.rooms.push(new Room(name));
    return true;
  }

  private joinRoom(name: string, socket: WebSocket) {
    const room = this.findRoom(name);

    if (!room) {
      return false;
    }

    return room.addSocket(socket);
  }

  private leaveRoom(name: string, socket: WebSocket) {
    const room = this.findRoom(name);

    if (!room) {
      return false;
    }

    return room.removeSocket(socket);
  }

  private sendMessage(name: string, message?: Message) {
    const room = this.findRoom(name);

    if (!room || !message?.text) {
      return false;
    }

    return room.sendMessage(message);
  }

  findRoom(name: string) {
    return this.rooms.find(r => r.name === name);
  }
}
