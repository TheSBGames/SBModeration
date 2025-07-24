const settings = require('../../../database/guild-settings');
const recentMessages = new Map();

module.exports = async (message) => {
  const guildSettings = await settings.get(message.guild.id);
  if (!guildSettings?.automod?.antiSpam) return;

  const key = `${message.guild.id}-${message.author.id}`;
  const now = Date.now();

  if (!recentMessages.has(key)) {
    recentMessages.set(key, { content: message.content, timestamp: now });
    return;
  }

  const last = recentMessages.get(key);
  if (last.content === message.content && now - last.timestamp < 2000) {
    await message.delete().catch(() => {});
    await message.channel.send(`${message.member}, please stop spamming.`).then(m => setTimeout(() => m.delete(), 5000));
  }

  recentMessages.set(key, { content: message.content, timestamp: now });
};
