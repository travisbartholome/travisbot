const fs = require('fs');
const tmi = require('tmi.js');

const config = require('./config');

// Create client
const client = new tmi.Client(config.tmiOptions);

// Define handler for the 'connected' event

const onConnectedHandler = (address, port) => {
  console.log(`Connected to ${address}:${port}`);
};

// Define message handler
const onMessageHandler = (target, context, message, fromSelf) => {
  // Bot should ignore messages from itself
  if (fromSelf) return;

  // Remove whitespace from message
  const msg = message.trim();

  // Parse commands
  if (msg === '!ping') {
    // Check to see if the bot is running/connected
    client.say(target, `@${context.username} Pong!`);
  }

  if (msg === '!np') {
    // "Now playing" command
    fs.readFile(config.npFile, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      client.say(target, data);
    });
  }

  if (msg === '!skin') {
    // Link to my current skin
    client.say(target, `Current skin: ${config.skinUrl}`);
  }
};

// Register event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch
client.connect();
