const wsHost = 'localhost';
const wsPort = '80';

const fullPath = `ws://${wsHost}:${wsPort}/StreamCompanion/LiveData/Stream`;
console.log(`Full URL we're connecting to: ${fullPath}`);

let ppCounterContainer;
let ppCurrent;
let ppDisplayArray = [];

const IN_ANIMATION_PROPS = {
  duration: 200,
  delay: (el, idx) => (el.parentNode.children.length - idx - 1) * 50,
  easing: 'easeInOutQuad',
  opacity: [0, 1],
  targets: '.pp-digit',
  translateY: ['50%', '0%'],
};

const OUT_ANIMATION_PROPS = {
  delay: (el, idx) => (el.parentNode.children.length - idx - 1) * 50,
  duration: 200,
  easing: 'easeInOutQuad',
  opacity: 0,
  targets: '.pp-digit',
  translateY: '-50%',
};

// TODO: fix this and actually implement something that works
function updatePPValue() {
  if (!ppCurrent || ppCurrent.length === 0) {
    ppDisplayArray = [];
    return;
    // TODO: test this to see what happens at the end of a map
    // TODO: possibly remove since this never seems to get called
  }

  const ppString = ppCurrent.slice(0, ppCurrent.indexOf('.')); // "123"
  const ppDisplayNewArray = ppString.split(''); // ['1', '2', '3']

  // Pad the shorter number with empty strings
  const currentLength = ppDisplayArray.length;
  const newLength = ppDisplayNewArray.length;
  if (newLength < currentLength) {
    for (let i = 0; i < currentLength - newLength; i += 1) {
      ppDisplayNewArray.unshift('');
    }
  } else if (newLength > currentLength) {
    for (let i = 0; i < newLength - currentLength; i += 1) {
      ppDisplayArray.unshift('');
    }
  }
  // Note length of both arrays should now be equal

  // TODO: remove
  console.log(ppCurrent);
  console.log(ppString);
  console.log(ppDisplayArray);
  console.log(ppDisplayNewArray);

  // TODO: refactor with array.reduce
  let index = 0;
  let newHTML = '';
  while (index < ppDisplayNewArray.length) {
    // Generate new digit elements to show pp
    newHTML += `<span class="pp-digit">${ppDisplayNewArray[index]}</span>`;

    index += 1;
  }

  // TODO: fix linter (not quite sure what the best strategy is here)
  // TODO: debug weird thing where if the browser window loses focus,
  //    the animation gets messed up
  // Animate rolling digits
  anime({
    ...OUT_ANIMATION_PROPS,
    complete: () => {
      ppCounterContainer.innerHTML = newHTML;
      anime(IN_ANIMATION_PROPS);
    },
  });

  ppDisplayArray = ppDisplayNewArray;
}

function startWebSocket() {
  const ws = new WebSocket(fullPath);

  ws.onopen = () => {
    setInterval(updatePPValue, 3000); // TODO: set to 1000 once done testing (1 second)
  };

  ws.onmessage = (event) => {
    const dataToken = JSON.parse(event.data);

    ppCurrent = dataToken.livepp_current_pp;
  };

  ws.onclose = () => {
    setTimeout(startWebSocket, 1000);
  };
}

window.onload = () => {
  ppCounterContainer = document.getElementById('pp-counter-container');
  startWebSocket();
};
