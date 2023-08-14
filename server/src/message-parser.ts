import { IEvents, allowedEvents } from './types/events';
import { schema, Message, idSchema } from './types/zod-types';

export class MessageParser {
  static parse(msg: string) {
    const [id, event, roomName, ...message] = msg.split(' ');

    const parsedMessage = this.checkText(message.join(' '));

    if (!this.checkMeta(event as IEvents, roomName) || !parsedMessage || !this.checkId(id)) {
      return;
    }

    return {
      event: event as IEvents,
      roomName,
      message: parsedMessage,
      id,
    };
  }

  private static checkId(id: string | undefined) {
    try {
      idSchema.parse(id);
      return true;
    } catch (e) {
      return false;
    }
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
