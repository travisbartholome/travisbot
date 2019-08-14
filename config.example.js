module.exports = {
  tmiOptions: {
    identity: {
      username: 'BOT_USERNAME', // Removed even though it probably doesn't matter
      password: 'OAUTH_TOKEN', // Removed for security
    },
    channels: [
      'travis_ba', // The channel(s) that the bot will chat in
    ],
  },

  // Twitch API client ID
  apiClientId: 'API_CLIENT_ID', // Removed for security

  // Path to osu! config file
  osuConfigFilePath: 'CONFIG_PATH', // Removed

  // Command-specific config info
  commands: {
    area: 'https://imgur.com/a/coHBAPE',
    commandList: 'https://travisbartholome.github.io/travisbot/',
    discord: 'https://discord.gg/ppy',
    grip: 'https://imgur.com/a/jjmq6kT',
    keyboard: 'Cooler Master MK750 (red switches)',
    npFile: 'D:\\Programs\\StreamCompanion\\Files\\np_stream_command.txt',
    skin: 'https://drive.google.com/file/d/1UQCSVK0M36nn4LN8x_vUHECSDNVuZ8Up/view',
    skinDefaultName: 'Seoul.v9 MPikazo',
    tablet: 'XP-Pen G430S',
    youtube: 'https://youtube.com',
  },
};
