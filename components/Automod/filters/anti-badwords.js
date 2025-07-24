const { PermissionsBitField } = require('discord.js');
const settings = require('../../../database/guild-settings');

const badWords = ['badword1', 'badword2', 'anotherword'];

module.exports = async (message) => {
  const guildSettings = await settings.get(message.guild.id);
  if (!guildSettings?.automod?.antiBadwords) return;

  const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
  if (isAdmin) return;

  const content = message.content.toLowerCase();
  if (badWords.some(w => content.includes(w))) {
    await message.delete().catch(() => {});
    await message.channel.send(`${message.member}, watch your language!`).then(m => setTimeout(() => m.delete(), 5000));
  }
};
