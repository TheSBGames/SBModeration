const { ActivityType, Events } = require('discord.js');
const registerCommands = require('../../utils/registerCommands');
const logger = require('../../utils/logger');
const chalk = require('chalk');

// Optional imports for scheduled tasks
const checkYouTube = require('../../utils/checkYouTube'); // if YouTube Notifier is enabled

module.exports = {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    logger.info(`🟢 Bot logged in as ${client.user.tag}`);

    // Set presence
    client.user.setPresence({
      activities: [{ name: 'SB', type: ActivityType.Listening }],
      status: 'online',
    });

    // Register application (slash) commands
    await registerCommands(client);
    logger.success('✅ Slash & context commands registered globally');

    // Log all connected guilds
    const guilds = client.guilds.cache.map(g => g.name);
    logger.info(`📌 Connected to ${guilds.length} guild(s): ${guilds.join(', ')}`);

    // OPTIONAL: Start YouTube notification polling
    setInterval(() => {
      checkYouTube(client); // polling logic inside this function
    }, 60 * 1000); // every 60s

    // Add any other init logic below if needed
    // e.g., preload cache, reconnect to DB, etc.
  },
};
