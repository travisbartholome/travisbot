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

  // Twitch API client information, used for authentication
  twitchApi: {
    clientId: 'API_CLIENT_ID', // Removed for security
    clientSecret: 'API_CLIENT_SECRET', // Removed for security
  },

  // Path to osu! config file
  osuConfigFilePath: 'CONFIG_PATH', // Removed

  // Command prefix (eg; !uptime vs ?uptime or .uptime)
  cmdPrefix: '!',

  // Command-specific config info
  commands: {
    area: null, // Leave null unless you don't use Hawku, or want to manually insert something - eg: 'https://imgur.com/a/coHBAPE'
    hawkuPath: '/mnt/c/path/to/Hawku/TabletDriverV0.2.3/config/config.xml', // Point this to the config.xml file inside of your hawku directory
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
