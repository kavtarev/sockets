const socket = new WebSocket('ws://localhost/server');

const btn = document.getElementById('btn');
const joinRoomButton = document.getElementById('btn-join');
const createRoomButton = document.getElementById('btn-create');
const inp = document.getElementById('inp');
const inpRoom = document.getElementById('inp-room');
const privateInp = document.getElementById('private');
const msg = document.getElementById('msg');
let id = '';

socket.onmessage = e => {
  const p = document.createElement('p');
  const mes = JSON.parse(e.data);

  if (mes.type === 'init') {
    id = mes.id;
    return;
  }

  p.innerText = `${mes.text}`;
  msg.appendChild(p);
};

btn.addEventListener('click', async () => {
  socket.send(`${id} message ${inpRoom.value} ${JSON.stringify({ text: inp.value, to: privateInp.value, isPrivate: !!privateInp.value })}`);
  inp.value = '';
});

joinRoomButton.addEventListener('click', async () => {
  socket.send(`${id} join ${inpRoom.value} ${JSON.stringify({ text: inp.value })}`);
});

createRoomButton.addEventListener('click', async () => {
  socket.send(`${id} create ${inpRoom.value} ${JSON.stringify({ text: inp.value })}`);
});
