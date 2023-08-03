const eventSource = new EventSource('http://localhost/sse-stream');
const sseDiv = document.getElementById('sse');

eventSource.onopen = function onSSEOpen() {
  console.log('Connection to server opened.');
};

eventSource.onerror = function onSSEError() {
  console.log('EventSource failed.');
};
eventSource.onmessage = message => {
  sseDiv.innerText = message.data;
};

const emitBtn = document.getElementById('emit');
emitBtn.addEventListener('click', async () => {
  await fetch('http://localhost:3000/emit');
});
