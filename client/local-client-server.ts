import { createServer, IncomingMessage, ServerResponse } from 'http';

import { readFile, appendFile } from 'fs/promises';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

createServer(async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url?.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
    const file = await readFile(`.${req.url}`);
    res.end(file);
  }
  if (req.url === '/style.css') {
    res.setHeader('Content-Type', 'text/css');
    const file = await readFile('style.css');
    res.end(file);
  }
  if (req.url?.endsWith('/upload')) {
    // const type = req.headers['mime-type'];
    const name = req.headers['file-name'];
    console.log(name);

    for await (const chunk of req) {
      await appendFile(`${name}`, chunk);
    }
    res.end('done');
  }
  if (req.url === '/emit') {
    let list = '';

    for await (const chunk of req) {
      list += chunk.toString();
    }

    emitter.emit('event-emitted', list);
  }
  if (req.url === '/sse-stream') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('cache-control', 'no-cache');

    emitter.on('event-emitted', (list: string) => {
      res.write(`data:${list}\n`);
      res.write('\n');
    });
  } else {
    const file = await readFile('index.html');
    res.end(file);
  }
}).listen(3000, () => {
  console.log('up on 3000');
});
