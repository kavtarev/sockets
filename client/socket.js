const socket = new WebSocket('ws://localhost:8080');

const btn = document.getElementById('btn');
const joinRoomButton = document.getElementById('btn-join');
const createRoomButton = document.getElementById('btn-create');
const inp = document.getElementById('inp');
const inpRoom = document.getElementById('inp-room');
const msg = document.getElementById('msg');

socket.onmessage = e => {
  const p = document.createElement('p');
  p.innerText = `${e.data}`;
  msg.appendChild(p);
};

btn.addEventListener('click', () => {
  socket.send(`message ${inpRoom.value} ${JSON.stringify({ text: inp.value })}`);
  inp.value = '';
});

joinRoomButton.addEventListener('click', () => {
  socket.send(`join ${inpRoom.value} ${JSON.stringify({ text: inp.value })}`);
});

createRoomButton.addEventListener('click', () => {
  socket.send(`create ${inpRoom.value} ${JSON.stringify({ text: inp.value })}`);
});
