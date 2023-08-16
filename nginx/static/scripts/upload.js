"use strict";
// import { socket } from './socket';
// const inp = document.getElementById('uploadInp') as HTMLInputElement;
// const btn = document.getElementById('uploadBtn') as HTMLButtonElement;
// btn.addEventListener('click', () => {
//   if (!inp.files) {
//     return;
//   }
//   const file = inp.files[0];
//   const fileReader = new FileReader();
//   fileReader.readAsArrayBuffer(file);
//   fileReader.onload = async ev => {
//     const result = ev?.target?.result as ArrayBuffer;
//     const SIZE = 1000;
//     const fileSize = result.byteLength;
//     for (let id = 0; id < fileSize / SIZE; id += 1) {
//       const chunk = result.slice(id * SIZE, (id + 1) * SIZE);
//       // socket.send();
//       // eslint-disable-next-line no-await-in-loop
//       await fetch('http://localhost:3000/upload', {
//         method: 'POST',
//         headers: {
//           'content-type': 'application/octet-stream',
//           'content-lenght': `${chunk.byteLength}`,
//           'mime-type': file.type,
//           'file-name': file.name,
//         },
//         body: chunk,
//       });
//     }
//   };
// });
//# sourceMappingURL=upload.js.map