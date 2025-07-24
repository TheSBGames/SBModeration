const { EmbedBuilder } = require('discord.js');
const db = require('../database/guild-settings');

module.exports = async function logEvent(guild, type, data) {
  const settings = await db.get(guild.id);
  const logChannelId = settings?.logChannel;

  if (!logChannelId) return;

  const channel = guild.channels.cache.get(logChannelId);
  if (!channel || !channel.permissionsFor(guild.members.me).has('SendMessages')) return;

  const embed = new EmbedBuilder()
    .setColor(data.color || 0x00b0f4)
    .setDescription(data.description)
    .setTimestamp()
    .setFooter({ text: data.footer || `Event: ${type}` });

  if (data.author) embed.setAuthor(data.author);
  if (data.title) embed.setTitle(data.title);
  if (data.fields) embed.addFields(data.fields);

  channel.send({ embeds: [embed] }).catch(() => {});
};
