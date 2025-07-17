const { EmbedBuilder } = require('discord.js');
const ModMailConfig = require('../../models/ModMailConfig');

module.exports = async (message, client) => {
  if (message.author.bot || message.guild) return;

  const allConfigs = await ModMailConfig.find({});
  if (!allConfigs?.length) return;

  allConfigs.forEach(async config => {
    const guild = await client.guilds.fetch(config.guildId).catch(() => null);
    if (!guild) return;

    const channel = guild.channels.cache.get(config.inboxChannelId);
    if (!channel) return;

    const threadName = `modmail-${message.author.id}`;
    let thread = guild.channels.cache.find(c => c.name === threadName);

    if (!thread) {
      thread = await guild.channels.create({
        name: threadName,
        type: ChannelType.GuildText,
        parent: config.inboxCategoryId || null,
        topic: `ModMail thread for ${message.author.tag} (${message.author.id})`,
        permissionOverwrites: [
          { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
          { id: client.user.id, allow: ['ViewChannel', 'SendMessages'] }
        ]
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('📩 New ModMail Message')
      .setDescription(message.content || 'No content')
      .setFooter({ text: `From ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setColor('Orange')
      .setTimestamp();

    thread.send({ embeds: [embed] });
  });
};
