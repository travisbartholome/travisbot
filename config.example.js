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

  // API client ID
  apiClientId: 'API_CLIENT_ID', // Removed for security

  // Command-specific config info
  commands: {
    npFile: 'D:\\Programs\\StreamCompanion\\Files\\np_stream_command.txt',
    skinUrl: 'https://drive.google.com/file/d/1UQCSVK0M36nn4LN8x_vUHECSDNVuZ8Up/view',
    area: 'https://imgur.com/a/coHBAPE',
    tablet: 'XP-Pen G430S',
    keyboard: 'Cooler Master MK750 (red switches)',
    grip: 'https://imgur.com/a/jjmq6kT',
  },
};
