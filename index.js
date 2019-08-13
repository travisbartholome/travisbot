const tmi = require('tmi.js');

const config = require('./config');

// Create client
const client = new tmi.Client(config); // TODO: make sure this works with the uppercase constructor

// Define handler for the 'connected' event

const onConnectedHandler = (address, port) => {
  console.log(`Connected to ${address}:${port}`);
};

// Define message handler
const onMessageHandler = () => {
  console.log('Message received');
};

// Register event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch
client.connect();
