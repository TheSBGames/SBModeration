const { PermissionsBitField } = require('discord.js');
const settings = require('../../../database/guild-settings');

module.exports = async (message) => {
  const guildSettings = await settings.get(message.guild.id);
  if (!guildSettings?.automod?.antiLink) return;

  const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
  if (isAdmin) return;

  const linkRegex = /https?:\/\/[^\s]+/gi;
  if (linkRegex.test(message.content)) {
    await message.delete().catch(() => {});
    await message.channel.send(`${message.member}, posting links is not allowed.`).then(m => setTimeout(() => m.delete(), 5000));
  }
};
