const socket = new WebSocket('ws://localhost/server');

const btn = document.getElementById('btn') as HTMLButtonElement;
const joinRoomButton = document.getElementById('btn-join') as HTMLButtonElement;
const createRoomButton = document.getElementById('btn-create') as HTMLButtonElement;
const inp = document.getElementById('inp') as HTMLInputElement;
const inpRoom = document.getElementById('inp-room') as HTMLInputElement;
const privateInp = document.getElementById('private') as HTMLInputElement;
const msg = document.getElementById('msg') as HTMLDivElement;
const uploadInp = document.getElementById('uploadInp') as HTMLInputElement;
const uploadBtn = document.getElementById('uploadBtn') as HTMLButtonElement;

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
  socket.send(
    `${id} message ${inpRoom.value} ${JSON.stringify({
      text: inp.value,
      to: privateInp.value,
      isPrivate: !!privateInp.value,
    })}`,
  );
  inp.value = '';
});

joinRoomButton.addEventListener('click', async () => {
  socket.send(`${id} join ${inpRoom.value} ${JSON.stringify({ text: inp.value })}`);
});

createRoomButton.addEventListener('click', async () => {
  socket.send(`${id} create ${inpRoom.value} ${JSON.stringify({ text: inp.value })}`);
});

uploadBtn.addEventListener('click', () => {
  if (!uploadInp.files) {
    return;
  }

  const file = uploadInp.files[0];
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = async () => {
    socket.send(
      `${id} message ${inpRoom.value} ${JSON.stringify({
        text: fileReader.result,
        to: privateInp.value,
        isPrivate: !!privateInp.value,
      })}`,
    );
  };
});
