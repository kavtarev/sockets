import { createServer } from 'http';
import { appendFile } from 'fs/promises';
import { randomUUID } from 'crypto';

import { Observer } from './src/observer.js';

const observer = new Observer();

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url?.endsWith('/favicon.ico')) {
    res.end();
    return;
  }

  if (req.url?.endsWith('/upload')) {
    // const type = req.headers['mime-type'];
    const name = req.headers['file-name'];
    console.log(name);

    for await (const chunk of req) {
      await appendFile(`${name}`, chunk);
    }
    res.end('done');
    return;
  }
  if (req.url === '/emit') {
    let list = '';

    for await (const chunk of req) {
      list += chunk.toString();
    }

    observer.send(list);
    res.end('');
    return;
  }
  if (req.url === '/count') {
    observer.count();
    res.end('');
    return;
  }
  if (req.url === '/sse-stream') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('cache-control', 'no-cache');
    const id = randomUUID();

    observer.addRes({ id, res });
    req.on('close', () => {
      observer.remove(id);
    });
    req.on('error', () => {
      observer.remove(id);
    });
  }
}).listen(3000, () => {
  console.log('up on 3000');
});
