import { MessageParser } from '../message-parser';

describe('MessageParser', () => {
  it('return void if incorrect event', () => {
    const msg = 'some body once told me';

    const res = MessageParser.parse(msg);

    expect(res).not.toBeDefined();
  });

  it('return void if no roomName', () => {
    const msg = 'join';

    const res = MessageParser.parse(msg);

    expect(res).not.toBeDefined();
  });

  it('work correctly if correct input', () => {
    const msg = `join room1 ${JSON.stringify({ text: 'hello' })}`;

    const res = MessageParser.parse(msg);

    expect(res?.event).toBe('join');
    expect(res?.roomName).toBe('room1');
    expect(res?.message.text).toBe('hello');
  });

  it('work correctly work with incorrect JSON', () => {
    const msg = 'join room1 f';

    const res = MessageParser.parse(msg);

    expect(res).not.toBeDefined();
  });
});
