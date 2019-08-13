const fs = require('fs');
const tmi = require('tmi.js');
const request = require('request-promise-native');

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
  const channelName = target.slice(1);
  const channelId = context['room-id'];

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

      client.say(target, data || 'No current map found D:');
    });
  }

  if (msg === '!skin') {
    // Link to my current skin
    client.say(target, `Current skin: ${config.skinUrl}`);
  }

  if (msg === '!uptime') {
    // Display stream uptime (fetched from the Twitch API)
    const options = {
      uri: `https://api.twitch.tv/helix/streams?user_id=${channelId}&first=1`,
      headers: {
        'Client-ID': config.apiClientId,
      },
      json: true,
    };

    request(options)
      .then((result) => {
        // If the user is offline, the Twitch API won't return data for their stream
        if (!result.data || result.data.length === 0) {
          client.say(target, `${channelName} is currently offline!`);
          return;
        }

        // Calculate and display stream uptime for a live stream
        const startedAt = result.data[0].started_at;
        const startTime = new Date(startedAt).getTime();
        const currentTime = Date.now();
        const uptimeInSeconds = Math.floor((currentTime - startTime) / 1000);

        const uptimeHours = Math.floor(uptimeInSeconds / 3600);
        const uptimeMinutes = Math.floor(uptimeInSeconds / 60) % 60;

        client.say(target, `Uptime: ${uptimeHours} hours, ${uptimeMinutes} minutes!`);
      })
      .catch(console.error);
  }
};

// Register event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch
client.connect();
