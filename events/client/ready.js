const { ActivityType } = require('discord.js');
const logger = require('../../utils/logger');
const checkYouTube = require('../../utils/checkYouTube');
// const connectLavalink = require('../../utils/connectLavalink'); // Uncomment if using music node manager

module.exports = {
  name: 'ready',
  once: true,

  async execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);
    logger(`Logged in as ${client.user.tag}`);

    // Set bot presence
    client.user.setPresence({
      activities: [{ name: 'SB', type: ActivityType.Listening }],
      status: 'online',
    });

    // Register slash commands globally
    try {
      await client.application.commands.set(client.slashCommands.map(cmd => cmd.data));
      logger('✅ Slash commands registered globally.');
    } catch (err) {
      console.error('❌ Error registering slash commands:', err);
    }

    // Start polling YouTube for new videos
    setInterval(() => {
      checkYouTube(client);
    }, 5 * 60 * 1000); // every 5 minutes

    // Lavalink connection or music system init (if applicable)
    // await connectLavalink(client); // optional

    logger('🎵 Bot is ready, presence and polling set.');
  }
};
