import { IEvents, allowedEvents } from './types/events';
import { schema, Message } from './types/zod';

export class MessageParser {
  static parse(msg: string) {
    const [event, roomName, ...message] = msg.split(' ');
    const parsedMessage = this.checkText(message.join(' '));

    if (!this.checkMeta(event as IEvents, roomName) || !parsedMessage) {
      return;
    }

    return { event: event as IEvents, roomName, message: parsedMessage };
  }

  private static checkMeta(event: IEvents | undefined, roomName: string | undefined) {
    if (!event || !allowedEvents.includes(event) || !roomName) {
      return false;
    }

    return true;
  }

  private static checkText(text: string | undefined): false | Message {
    if (!text) {
      return {} as Message;
    }

    try {
      const obj = JSON.parse(text);
      schema.parse(obj);
      return obj;
    } catch (e) {
      return false;
    }
  }
}
