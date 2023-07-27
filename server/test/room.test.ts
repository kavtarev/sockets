import { WebSocket } from 'ws';
import { Room } from '../room';

describe('MessageParser', () => {
  it('correctly add sockets', () => {
    const room = new Room('some');
    const socket1 = { pong() {} } as WebSocket;
    const socket2 = { pong() {} } as WebSocket;

    room.addSocket(socket1);
    room.addSocket(socket2);

    expect(room['sockets'].length).toBe(2);
  });

  it('remove socket', () => {
    const room = new Room('some');
    const socket1 = { pong() {} } as WebSocket;
    const socket2 = { pong() {} } as WebSocket;

    room.addSocket(socket1);
    room.addSocket(socket2);

    room.removeSocket(socket1);

    expect(room['sockets'].length).toBe(1);
  });
});
