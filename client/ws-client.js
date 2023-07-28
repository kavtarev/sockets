class Client {
  constructor() {
    this.client = new WebSocket('ws://localhost/server');

    this.client.addEventListener('open', () => {
      this.sendMessage('open connection');
    });
  }

  sendMessage(event, room, msg) {
    this.client.send(`${event} ${room} ${msg}`);
  }
}

export function createClient() {
  return new Client();
}
