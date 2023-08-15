import { randomUUID } from 'crypto';
import { MessageParser } from '../src/message-parser';

describe('MessageParser', () => {
  it('return void if incorrect id', () => {
    const msg = 'kok some body once told me';

    const res = MessageParser.parse(msg);

    expect(res).not.toBeDefined();
  });

  it('return void if incorrect event', () => {
    const msg = `${randomUUID()} some body once told me`;

    const res = MessageParser.parse(msg);

    expect(res).not.toBeDefined();
  });

  it('return void if no roomName', () => {
    const msg = `${randomUUID()} join`;

    const res = MessageParser.parse(msg);

    expect(res).not.toBeDefined();
  });

  it('work correctly if correct input', () => {
    const id = randomUUID();
    const msg = `${id} join room1 ${JSON.stringify({ text: 'hello', type: 'text' })}`;

    const res = MessageParser.parse(msg);

    expect(res?.event).toBe('join');
    expect(res?.id).toBe(id);
    expect(res?.roomName).toBe('room1');
    expect(res?.message.text).toBe('hello');
  });

  it('work correctly work with incorrect JSON', () => {
    const msg = `${randomUUID()} join room1 press f for respect`;

    const res = MessageParser.parse(msg);

    expect(res).not.toBeDefined();
  });
});
