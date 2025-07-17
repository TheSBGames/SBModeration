const { EmbedBuilder } = require('discord.js');
const WelcomeSettings = require('../../models/WelcomeSettings');

module.exports = async (member) => {
  const settings = await WelcomeSettings.findOne({ guildId: member.guild.id });
  if (!settings || !settings.leaveChannelId || !settings.leaveMessage) return;

  const channel = member.guild.channels.cache.get(settings.leaveChannelId);
  if (!channel) return;

  const leaveText = settings.leaveMessage
    .replace(/{user}/g, `<@${member.id}>`)
    .replace(/{server}/g, member.guild.name)
    .replace(/{memberCount}/g, member.guild.memberCount.toString());

  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('👋 Member Left')
    .setDescription(leaveText)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

  channel.send({ embeds: [embed] }).catch(() => null);
};
