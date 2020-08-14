const wsHost = 'localhost';
const wsPort = '80';

const fullPath = `ws://${wsHost}:${wsPort}/StreamCompanion/LiveData/Stream`;
console.log(`Full URL we're connecting to: ${fullPath}`);

let ppCounterContainer;
let ppCurrent;
let ppDisplayArray = [];

const PP_COUNTER_UPDATE_INTERVAL = 500;

const IN_ANIMATION_PROPS = {
  duration: 50,
  // Could use this delay function to get a "propagation" effect for the animation
  // delay: (el, idx) => (el.parentNode.children.length - idx - 1) * 50,
  easing: 'easeInOutQuad',
  opacity: [0, 1],
  targets: '.pp-digit-animate-in',
  translateY: ['50%', '0%'],
};

const OUT_ANIMATION_PROPS = {
  // delay: (el, idx) => (el.parentNode.children.length - idx - 1) * 50,
  duration: 50,
  easing: 'easeInOutQuad',
  opacity: 0,
  targets: '.pp-digit-animate-out',
  translateY: '-50%',
};

function updatePPValue() {
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

  // Put each digit in a span, add animation target classes
  const newHTML = ppDisplayNewArray.reduce(
    (html, currentDigit, currentIndex) => {
      let className = 'pp-digit';
      if (currentDigit !== ppDisplayArray[currentIndex]) {
        className += ' pp-digit-animate-in';

        // Apply out animation class to the span currently on the page
        const digitOnPage = ppCounterContainer.children[currentIndex];
        if (digitOnPage) {
          digitOnPage.classList.add('pp-digit-animate-out');
        }
      }
      return `${html}<span class="${className}">${currentDigit}</span>`;
    },
    '',
  );

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
    setInterval(updatePPValue, PP_COUNTER_UPDATE_INTERVAL);
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
