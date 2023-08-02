import { WebSocket } from 'ws';
import { randomUUID } from 'crypto';
import { Room } from '../room';

describe('MessageParser', () => {
  it('correctly add sockets', () => {
    const room = new Room('some');
    const id1 = randomUUID();
    const socket1 = { pong() {} } as WebSocket;

    const id2 = randomUUID();
    const socket2 = { pong() {} } as WebSocket;

    room.addSocket({ socket: socket1, id: id1 });
    room.addSocket({ socket: socket2, id: id2 });

    expect(room['sockets'].length).toBe(2);
  });

  it('remove socket', () => {
    const room = new Room('some');
    const id1 = randomUUID();
    const socket1 = { pong() {} } as WebSocket;

    const id2 = randomUUID();
    const socket2 = { pong() {} } as WebSocket;

    room.addSocket({ socket: socket1, id: id1 });
    room.addSocket({ socket: socket2, id: id2 });

    room.removeSocket(socket1);

    expect(room['sockets'].length).toBe(1);
  });
});
