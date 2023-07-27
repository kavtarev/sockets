const { createServer } = require('http');
const { readFile } = require('fs/promises');

createServer(async (req, res) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
    const file = await readFile(`.${req.url}`);
    res.end(file);
  }
  if (req.url === '/style.css') {
    res.setHeader('Content-Type', 'text/css');
    const file = await readFile('./style.css');
    res.end(file);
  } else {
    const file = await readFile('./index.html');
    res.end(file);
  }
}).listen(3000, () => { console.log('up on 3000'); });
