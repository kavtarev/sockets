import { createServer } from 'http';
import { appendFile, readFile } from 'fs/promises';
import { randomUUID } from 'crypto';

import { Observer } from './src/observer.js';

const observer = new Observer();

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url?.endsWith('.js') || req.url?.endsWith('.js.map')) {
    res.setHeader('Content-Type', 'application/javascript');
    const file = await readFile(`./dist/src/scripts${req.url}`);
    res.end(file);
  }
  if (req.url === '/style.css') {
    res.setHeader('Content-Type', 'text/css');
    const file = await readFile('./dist/src/html/style.css');
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

    observer.send(list);
    res.end('');
  }
  if (req.url === '/count') {
    observer.count();
    res.end('');
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
  } else {
    const file = await readFile('./dist/src/html/index.html');
    res.end(file);
  }
}).listen(3000, () => {
  console.log('up on 3000');
});
