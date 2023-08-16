"use strict";
const eventSource = new EventSource('http://localhost/sse-stream');
const sseDiv = document.getElementById('sse');
eventSource.onopen = function onSSEOpen() {
    console.log('Connection to server opened.');
};
eventSource.onerror = function onSSEError() {
    console.log('EventSource failed.');
};
eventSource.onmessage = message => {
    const rooms = JSON.parse(message.data);
    sseDiv.innerText = '';
    for (const room of rooms) {
        const p = document.createElement('p');
        p.innerText = room;
        p.id = 'room';
        sseDiv.insertAdjacentElement('beforeend', p);
    }
};
//# sourceMappingURL=sse.js.map