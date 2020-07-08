const wsHost = 'localhost';
const wsPort = '80';

const fullPath = `ws://${wsHost}:${wsPort}/StreamCompanion/LiveData/Stream`;
console.log(`Full URL we're connecting to: ${fullPath}`);

let ppCounterContainer;
let ppCurrent;
const ppCurrentArray = [];

function startWebSocket() {
  const ws = new WebSocket(fullPath);

  ws.onmessage = (event) => {
    const dataToken = JSON.parse(event.data);

    // console.log(dataToken);
    // ppCounterContainer.innerHTML = dataToken.livepp_current_pp;

    ppCurrent = dataToken.livepp_current_pp;
  };

  ws.onclose = () => {
    setTimeout(startWebSocket, 1000);
  };
}

// TODO: fix this and actually implement something that works
function updatePPValue() {
  const ppString = ppCurrent.slice(0, ppCurrent.indexOf('.'));
  const ppNewArray = ppString.split('');

  console.log(ppCurrent); // TODO: fix

  const currentIndex = ppCurrentArray.length - 1;
  const newIndex = ppNewArray.length - 1;

  if (currentIndex < 0 || newIndex < 0) {
    ppCurrentArray = ppNewArray;
    // render and return
  }

  while (currentIndex >= 0 && newIndex >= 0) {
    // TODO: animate digit changes where applicable
  }
}

window.onload = () => {
  ppCounterContainer = document.getElementById('pp-counter-container');
  startWebSocket();
  setInterval(updatePPValue, 1000);
};
