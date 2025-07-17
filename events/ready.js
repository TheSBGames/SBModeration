const { ActivityType, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const registerSlashCommands = require('../handlers/registerSlashCommands');
const loadPrefixCommands = require('../handlers/loadPrefixCommands');

module.exports = {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    console.log(`[✅] Logged in as ${client.user.tag}`);

    // ✅ Set bot presence
    client.user.setPresence({
      activities: [{ name: 'SB', type: ActivityType.Listening }],
      status: 'online',
    });

    // ✅ Register slash commands globally
    await registerSlashCommands(client);

    // ✅ Load prefix commands
    await loadPrefixCommands(client);

    // ✅ Optional: Initialize cooldowns and cache (for XP, auto systems, etc.)
    client.cooldowns = new Map();
    client.chatGPTChannels = new Map(); // For ChatGPT channel chat
    client.modmailCache = new Map(); // Optional modmail cache

    // ✅ Prepare ticket/autoresponder/autorole/automod systems if needed
    // (You can initialize databases, caches or config here if needed)

    // ✅ Custom console message
    console.log(`[🚀] SB Moderation bot is fully operational.`);

    // Log total commands
    console.log(`[💡] ${client.commands.size} prefix commands loaded.`);
    console.log(`[💡] ${client.slashCommands.size} slash commands loaded.`);
  }
};
