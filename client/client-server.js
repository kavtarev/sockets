const { createServer } = require('http');
const { readFile } = require('fs/promises');
const { EventEmitter } = require('events');

const emitter = new EventEmitter();

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
    const file = await readFile(`./client${req.url}`);
    res.end(file);
  }
  if (req.url === '/style.css') {
    res.setHeader('Content-Type', 'text/css');
    const file = await readFile('./client/style.css');
    res.end(file);
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

    emitter.on('event-emitted', (list) => {
      res.write(`data:${list}\n`);
      res.write('\n');
    });
  } else {
    const file = await readFile('./client/index.html');
    res.end(file);
  }
}).listen(3000, () => { console.log('up on 3000'); });
