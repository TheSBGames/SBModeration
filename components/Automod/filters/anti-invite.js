const { PermissionsBitField } = require('discord.js');
const settings = require('../../../database/guild-settings');

module.exports = async (message) => {
  const guildSettings = await settings.get(message.guild.id);
  if (!guildSettings?.automod?.antiInvite) return;

  const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
  if (isAdmin) return;

  const inviteRegex = /(discord\.gg\/|discord\.com\/invite\/)/gi;
  if (inviteRegex.test(message.content)) {
    await message.delete().catch(() => {});
    await message.channel.send(`${message.member}, server invites are not allowed.`).then(m => setTimeout(() => m.delete(), 5000));
  }
};
