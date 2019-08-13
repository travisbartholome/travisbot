# travisbot

It's a Twitch bot.

## Running

Set up a file named `config.js` in the root directory, with the following structure:

```javascript
module.exports = {
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN
  },
  channels: [
    CHANNEL_NAME
  ]
};
```

See [this link](https://dev.twitch.tv/docs/irc/) for variable descriptions.
The structure of the config object is the same.

Run the bot using `node index.js`, or by running `npm start` in the repository's root directory.
