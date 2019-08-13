const fs = require('fs');
const readline = require('readline');

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
    fs.readFile(config.commands.npFile, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      client.say(target, data || 'No current map found D:');
    });
  }

  if (msg === '!skin') {
    // Link to my current skin
    const { skin, skinDefaultName } = config.commands;
    const skinConfigPrefix = 'Skin = ';

    let skinMsg = `Usual skin: ${skin}`;

    if (config.osuConfigFilePath) {
      // If the skin in use on stream isn't the one typically in use,
      // the bot can make a note of that as well
      // Reads the osu! config file to see what skin is currently in use
      const cfgReadLine = readline.createInterface({
        input: fs.createReadStream(config.osuConfigFilePath),
      });

      cfgReadLine.on('line', (line) => {
        if (line.startsWith(skinConfigPrefix)) {
          const currentSkinName = line.slice(skinConfigPrefix.length);

          // If the user specifies a "default" skin name, the bot won't
          // bother printing the current in-use skin when it has the same
          // name as the default
          if (!skinDefaultName || currentSkinName !== skinDefaultName) {
            skinMsg += ` (currently using: ${currentSkinName})`;
          }
        }
      });

      cfgReadLine.on('close', () => {
        client.say(target, skinMsg);
      });
    } else {
      client.say(target, skinMsg);
    }
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

  if (msg === '!area') {
    // Send tablet area
    client.say(target, `Tablet area: ${config.commands.area}`);
  }

  if (msg === '!tablet') {
    // Send tablet information
    client.say(target, `Tablet: ${config.commands.tablet}`);
  }

  if (msg === '!keyboard') {
    // Send keyboard information
    client.say(target, `Keyboard: ${config.commands.keyboard}`);
  }

  if (msg === '!grip') {
    // Send tablet grip information
    client.say(target, `Tablet pen grip: ${config.commands.grip}`);
  }

  if (msg === '!commands') {
    // Send the list of available commands
    client.say(target, `Command list: ${config.commands.commandList}`);
  }
};

// Register event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch
client.connect();
