import { ServerResponse } from 'http';

type Listener = { id: string; res: ServerResponse };

export class Observer {
  listeners: Listener[] = [];

  addRes(res: Listener) {
    this.listeners.push(res);
  }

  send(list: string) {
    this.listeners.forEach(res => {
      res.res.write(`data:${list}\n`);
      res.res.write('\n');
    });
  }

  count() {
    console.log('listeners count', this.listeners.length);
  }

  remove(id: string) {
    this.listeners = this.listeners.filter(res => id !== res.id);
  }
}
