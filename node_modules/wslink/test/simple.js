/* global document */
import WebsocketConnection from '../src/WebsocketConnection';
import SmartConnect from '../src/SmartConnect';

// this template allows us to use HtmlWebpackPlugin
// in webpack to generate our index.html
// expose-loader makes our 'export' functions part of the 'app' global
const htmlContent = `<button onClick="app.connect()">Connect</button>
<button onClick="app.wsclose()">Disconnect</button>
<br/>
<input type="text" value="1,2,3,4,5" class="input" />
<button onClick="app.sendInput('add')">Send Add</button>
<button onClick="app.sendInput('mult')">Send Mult</button>
<button onClick="app.sendImage('unwrapped.image')">Send Image</button>
<button onClick="app.testNesting()">Test Nesting</button>
<button onClick="app.toggleStream()">Sub/Unsub</button>
<button onClick="app.sendMistake()">Mistake</button>
<button onClick="app.sendInput('special')">Test NaN</button>
<button onClick="app.sendServerQuit()">Server Quit</button>
<br/>
<textarea class="output" rows="12" cols="50"></textarea>
<br/>
<canvas class="imageCanvas" width="300px" height="300px"></canvas>
`;

const rootContainer = document.querySelector('body');
const controlContainer = document.createElement('div');
rootContainer.appendChild(controlContainer);
controlContainer.innerHTML = htmlContent;

const inputElement = document.querySelector('.input');
const logOutput = document.querySelector('.output');
let ws = null;
let subscription = false;
let session = null;

function log(msg) {
  console.log(msg);
  logOutput.innerHTML += msg;
  logOutput.innerHTML += '\n';
}
function logerr(err) {
  console.error(err);
  logOutput.innerHTML += `error: ${err.code}, "${err.message}", ${err.data}`;
  logOutput.innerHTML += '\n';
}

export function sendInput(type) {
  if (!session) return;
  const data = JSON.parse('[' + inputElement.value + ']');
  session.call(`myprotocol.${type}`, [data]).then(
    (result) => log('result ' + result),
    (err) => logerr(err)
  );
}
export function sendImage(type) {
  if (!session) return;
  session.call(`myprotocol.${type}`, []).then(
    (result) => {
      log('result ' + result);
      handleMessage(result);
    },
    (err) => logerr(err)
  );
}
function handleMessage(inData) {
  let data = Array.isArray(inData) ? inData[0] : inData;
  let blob = data.blob || data;
  if (blob instanceof Blob) {
    const canvas = document.querySelector('.imageCanvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const reader = new FileReader();
    reader.onload = function (e) {
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = e.target.result;
    };
    reader.readAsDataURL(blob);
  } else {
    log('result ' + blob);
  }
}

export function testNesting() {
  if (!session) return;
  session.call('myprotocol.nested.image', []).then(
    (data) => {
      if (data['image']) handleMessage(data['image']);
      const onload = (e) => {
        const arr = new Uint8Array(e.target.result);
        if (arr.length === 4) {
          arr.forEach((d, i) => {
            if (d !== i + 1) console.error('mismatch4', d, i);
          });
        } else if (arr.length === 6) {
          arr.forEach((d, i) => {
            if (d !== i + 5) console.error('mismatch4', d, i);
          });
        } else {
          console.error('Size mismatch', arr.length);
        }
      };
      data.bytesList.forEach((bl) => {
        const reader = new FileReader();
        reader.onload = onload;
        reader.readAsArrayBuffer(bl);
      });

      console.log('Nesting:', data);
    },
    (err) => logerr(err)
  );
}

export function sendMistake() {
  if (!session) return;
  session
    .call('myprotocol.mistake.TYPO', ['ignored'])
    .then(handleMessage, (err) => logerr(err));
}

export function sendServerQuit() {
  if (!session) return;
  session.call('application.exit.later', [5]).then(
    (result) => log('result ' + result),
    (err) => logerr(err)
  );
}

export function toggleStream() {
  if (!subscription) {
    subscription = session.subscribe('image', handleMessage);
    session.call('myprotocol.stream', ['image']).then(
      (result) => log('result ' + result),
      (err) => logerr(err)
    );
  } else {
    session.call('myprotocol.stop', ['image']).then(
      (result) => log('result ' + result),
      (err) => logerr(err)
    );
    // session.unsubscribe(subscription);
    subscription.unsubscribe();
    subscription = null;
  }
}

export function wsclose() {
  if (!session) return;
  session.close();
  // it's fine to destroy the WebsocketConnection, but you won't get the WS close message.
  // if (ws) ws.destroy();
  // ws = null;
}

export function connect(direct = false) {
  ws = null;
  if (direct) {
    ws = WebsocketConnection.newInstance({ urls: 'ws://localhost:8080/ws' });
  } else {
    const config = { application: 'simple' };
    ws = SmartConnect.newInstance({ config });
  }
  ws.onConnectionReady(() => {
    log('WS open');
    if (!session) {
      session = ws.getSession();
    }
    const canvas = document.querySelector('.imageCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 300, 300);
  });

  ws.onConnectionClose(() => {
    log('WS close');
  });

  ws.onConnectionError((event) => {
    log('WS error');
    console.error(event);
  });

  session = ws.connect();
}
