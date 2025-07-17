const { EmbedBuilder, ChannelType } = require('discord.js');
const ModMailConfig = require('../../models/ModMailConfig');
const ModMailLog = require('../../models/ModMailLog');

module.exports = async (message, client) => {
  if (message.author.bot || !message.guild) return;

  // This section handles replies from mod to user
  if (message.channel.name?.startsWith('modmail-') && message.reference) {
    const config = await ModMailConfig.findOne({ guildId: message.guild.id });
    if (!config) return;

    const userId = message.channel.name.split('modmail-')[1];
    const user = await client.users.fetch(userId).catch(() => null);
    if (!user) return;

    const role = message.member.roles.highest;
    const embed = new EmbedBuilder()
      .setAuthor({ name: `${message.member.displayName} (${role.name})`, iconURL: message.author.displayAvatarURL() })
      .setDescription(message.content || 'No message content')
      .setColor('Blue')
      .setTimestamp();

    await user.send({ embeds: [embed] }).catch(() => null);

    // Logging the ModMail reply
    if (config.logChannelId) {
      const logChannel = message.guild.channels.cache.get(config.logChannelId);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('📨 ModMail Reply Sent')
          .addFields(
            { name: 'To User', value: `<@${userId}> (${userId})` },
            { name: 'By', value: `<@${message.author.id}> (${message.author.tag})` },
            { name: 'Content', value: message.content || 'No content' }
          )
          .setColor('Green')
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] }).catch(() => null);
      }
    }
  }
};
