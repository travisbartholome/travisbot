const fs = require('fs');
const readline = require('readline');

const axios = require('axios').default;
const tmi = require('tmi.js');

const getAppAuthToken = require('./util/getAppAuthToken');
const getFollowage = require('./commands/followage');
const hawku = require('./commands/hawku');

const config = require('../config');
const cmdPrefix = config.cmdPrefix;

const hawku = require('./commands/hawku');

const { cmdPrefix } = config;

let appAccessToken; // App authentication token for Twitch API

// Create client
const client = new tmi.Client(config.tmiOptions);

// Define handler for the 'connected' event
const onConnectedHandler = (address, port) => {
  console.log(`Connected to ${address}:${port}`);
};

// Define message handler
const onMessageHandler = (target, context, message, fromSelf) => {
  // Bot should ignore messages from itself
  if (fromSelf) {
    return;
  }

  // Parse message to see if the correct command prefix is present
  // If so, continue
  if (message.trim()[0] !== cmdPrefix) {
    return;
  }

  const msg = message.trim().slice(1); // Remove command prefix
  const channelName = target.slice(1);
  const channelId = context['room-id'];

  // Common options for Twitch API calls
  const twitchApiOptions = {
    headers: {
      Authorization: `Bearer ${appAccessToken}`,
      'Client-ID': config.twitchApi.clientId,
    },
  };

  // Parse commands
  if (msg === 'ping') {
    // Check to see if the bot is running/connected
    client.say(target, `@${context.username} Pong!`);
  }

  if (msg === 'np' || msg === 'map') {
    // "Now playing" command
    fs.readFile(config.commands.npFile, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      client.say(target, data || 'No current map found D:');
    });
  }

  if (msg === 'skin') {
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

  if (msg === 'area') {
    let areaMsg;
    const hawkuDetails = hawku.getDetails();
    const tabletArea = hawku.getArea();
    const {
      width, height, maxWidth, maxHeight,
    } = tabletArea;
    const { forceAspectRatio, fullArea } = hawkuDetails;

    // Create a message specific to the user's tablet area options
    if (config.commands.hawkuPath) {
      if (fullArea) {
        if (forceAspectRatio) {
          areaMsg = `Full area | ${maxWidth}mm | Forced Aspect Ratio`;
        } else {
          areaMsg = `Full area | ${width}mm x ${height}mm`;
        }
      } else if (forceAspectRatio) {
        areaMsg = `Width: ${width}mm | Forced Aspect Ratio`;
      } else {
        areaMsg = `Width: ${width}mm of ${maxWidth}mm, Height: ${height}mm of ${maxHeight}mm`;
      }
      client.say(target, areaMsg);
    }

    // Send static tablet area message if one is set in config
    if (config.commands.area) {
      client.say(target, `Tablet area: ${config.commands.area}`);
    }
  }

  if (msg === 'areadetails') {
    if (config.commands.hawkuPath) {
      const hawkuDetails = hawku.getDetails();
      if (hawkuDetails.outputMode) {
        const areaDetailsMsg = `Full area: ${hawkuDetails.fullArea}, `
        + `Smoothed Output: ${hawkuDetails.smoothing}, `
        + `Output Mode: ${hawkuDetails.outputMode}, `
        + `Resolution: ${hawkuDetails.resolution} | Use ${cmdPrefix}area to see dimensions`;
        client.say(target, areaDetailsMsg);
      }
    }
  }

  if (msg === 'uptime') {
    // Display stream uptime (fetched from the Twitch API)
    axios.get(
      `https://api.twitch.tv/helix/streams?user_id=${channelId}&first=1`,
      twitchApiOptions,
    )
      .then(({ data: result }) => {
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

  if (msg === 'tablet') {
    // Send tablet information
    client.say(target, `Tablet: ${config.commands.tablet}`);
  }

  if (msg === 'keyboard') {
    // Send keyboard information
    client.say(target, `Keyboard: ${config.commands.keyboard}`);
  }

  if (msg === 'grip') {
    // Send tablet grip information
    client.say(target, `Tablet pen grip: ${config.commands.grip}`);
  }

  if (msg === 'commands') {
    // Send the list of available commands
    client.say(target, `Command list: ${config.commands.commandList}`);
  }

  if (msg === 'discord') {
    // Send a Discord server invite
    client.say(target, `Discord: ${config.commands.discord}`);
  }

  if (msg === 'youtube') {
    // Send a YouTube channel link
    client.say(target, `YouTube channel: ${config.commands.youtube}`);
  }

  if (msg === 'followage') {
    // Calculate how long the sender has been following the channel
    const fromUser = context['user-id'];
    const fromDisplayName = context['display-name'];
    const toUser = context['room-id'];

    getFollowage(fromUser, fromDisplayName, toUser, twitchApiOptions)
      .then((followageMsg) => {
        client.say(target, followageMsg);
      })
      .catch(console.error);
  }
};

// Register event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect client to Twitch once we've gotten an OAuth token for API calls
getAppAuthToken().then((token) => {
  appAccessToken = token;

  client.connect();
});
