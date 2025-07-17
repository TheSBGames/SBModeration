const { EmbedBuilder } = require('discord.js');
const WelcomeSettings = require('../../models/WelcomeSettings');

module.exports = async (member) => {
  const settings = await WelcomeSettings.findOne({ guildId: member.guild.id });
  if (!settings || !settings.welcomeChannelId || !settings.welcomeMessage) return;

  const channel = member.guild.channels.cache.get(settings.welcomeChannelId);
  if (!channel) return;

  const welcomeText = settings.welcomeMessage
    .replace(/{user}/g, `<@${member.id}>`)
    .replace(/{server}/g, member.guild.name)
    .replace(/{memberCount}/g, member.guild.memberCount.toString());

  const embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('🎉 New Member Joined!')
    .setDescription(welcomeText)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

  channel.send({ embeds: [embed] }).catch(() => null);
};
