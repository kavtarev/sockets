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
const img = document.getElementById('img') as HTMLImageElement;

let id = '';

socket.onmessage = e => {
  const message = JSON.parse(e.data);

  if (message.event === 'init') {
    id = message.id;
    return;
  }

  if (message.type === 'text') {
    const p = document.createElement('img');
    p.innerText = `${message.text}`;
    const encoded = Uint8Array.from([...message.text].map(ch => ch.charCodeAt(0)));

    const blob = new Blob([encoded], { type: 'image/jpeg' });
    const urlCreator = window.URL || window.webkitURL;

    const imageUrl = urlCreator.createObjectURL(blob);
    img.src = imageUrl;
    msg.appendChild(p);
  }

  if (message.type === 'image') {
    const imgMessage = document.createElement('img');
    msg.appendChild(imgMessage);
  }
};

btn.addEventListener('click', async () => {
  if (!inpRoom.value) {
    return;
  }
  socket.send(
    `${id} message ${inpRoom.value} ${JSON.stringify({
      text: inp.value,
      to: privateInp.value,
      isPrivate: !!privateInp.value,
      type: 'text',
    })}`,
  );
  inp.value = '';
});

joinRoomButton.addEventListener('click', async () => {
  if (!inpRoom.value) {
    return;
  }
  socket.send(`${id} join ${inpRoom.value} ${JSON.stringify({ text: inp.value, type: 'text' })}`);
});

createRoomButton.addEventListener('click', async () => {
  if (!inpRoom.value) {
    return;
  }
  socket.send(`${id} create ${inpRoom.value} ${JSON.stringify({ text: inp.value, type: 'text' })}`);
});

uploadBtn.addEventListener('click', () => {
  if (!uploadInp.files) {
    return;
  }

  const file = uploadInp.files[0];
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  fileReader.onload = async ev => {
    if (!ev.target?.result) {
      return;
    }

    const arrayBufferView = new Uint8Array(ev.target.result as ArrayBuffer);
    const decoded = String.fromCharCode(...new Uint8Array(arrayBufferView));

    socket.send(
      `${id} message ${inpRoom.value} ${JSON.stringify({
        text: decoded,
        to: privateInp.value,
        isPrivate: !!privateInp.value,
        type: 'image',
      })}`,
    );
  };
});
