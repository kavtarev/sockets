"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const socket = new WebSocket('ws://localhost/server');
const btn = document.getElementById('btn');
const joinRoomButton = document.getElementById('btn-join');
const createRoomButton = document.getElementById('btn-create');
const inp = document.getElementById('inp');
const inpRoom = document.getElementById('inp-room');
const privateInp = document.getElementById('private');
const msg = document.getElementById('msg');
const uploadInp = document.getElementById('uploadInp');
const uploadBtn = document.getElementById('uploadBtn');
const img = document.getElementById('img');
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
btn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!inpRoom.value) {
        return;
    }
    socket.send(`${id} message ${inpRoom.value} ${JSON.stringify({
        text: inp.value,
        to: privateInp.value,
        isPrivate: !!privateInp.value,
        type: 'text',
    })}`);
    inp.value = '';
}));
joinRoomButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!inpRoom.value) {
        return;
    }
    socket.send(`${id} join ${inpRoom.value} ${JSON.stringify({ text: inp.value, type: 'text' })}`);
}));
createRoomButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!inpRoom.value) {
        return;
    }
    socket.send(`${id} create ${inpRoom.value} ${JSON.stringify({ text: inp.value, type: 'text' })}`);
}));
uploadBtn.addEventListener('click', () => {
    if (!uploadInp.files) {
        return;
    }
    const file = uploadInp.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (ev) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = ev.target) === null || _a === void 0 ? void 0 : _a.result)) {
            return;
        }
        const arrayBufferView = new Uint8Array(ev.target.result);
        const decoded = String.fromCharCode(...new Uint8Array(arrayBufferView));
        socket.send(`${id} message ${inpRoom.value} ${JSON.stringify({
            text: decoded,
            to: privateInp.value,
            isPrivate: !!privateInp.value,
            type: 'image',
        })}`);
    });
});
//# sourceMappingURL=socket.js.map