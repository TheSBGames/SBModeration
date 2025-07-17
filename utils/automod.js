const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  /**
   * Executes a punishment action based on automod settings.
   * @param {Client} client - The Discord bot client.
   * @param {Message} message - The message that triggered automod.
   * @param {'timeout'|'kick'|'ban'|'mute'} action - The action to take.
   * @returns {Promise<'deleted'|'failed'|'success'>}
   */
  async takeAction(client, message, action = 'timeout') {
    const member = message.member;

    // Delete the triggering message
    await message.delete().catch(() => {});
    let success = false;

    const reason = 'Automod violation (message content)';
    const embed = new EmbedBuilder()
      .setTitle('🚨 AutoModeration Triggered')
      .setDescription(`Action: **${action}**\nUser: ${member.user.tag} (${member.id})`)
      .setColor('Red')
      .setTimestamp();

    try {
      switch (action) {
        case 'timeout':
          if (member.moderatable) {
            await member.timeout(10 * 60 * 1000, reason); // 10 minutes
            success = true;
          }
          break;

        case 'kick':
          if (member.kickable) {
            await member.kick(reason);
            success = true;
          }
          break;

        case 'ban':
          if (member.bannable) {
            await member.ban({ reason });
            success = true;
          }
          break;

        case 'mute':
          const muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
          if (muteRole && member.roles.highest.position < message.guild.members.me.roles.highest.position) {
            await member.roles.add(muteRole, reason);
            success = true;
          }
          break;

        default:
          break;
      }

      // Log the action if a log channel is configured
      const logChannelId = require('./database').get(`automod_log_${message.guild.id}`);
      if (logChannelId) {
        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (logChannel && logChannel.isTextBased()) {
          logChannel.send({ embeds: [embed] }).catch(() => {});
        }
      }

      return 'deleted';
    } catch (err) {
      console.error('Automod error:', err);
      return 'failed';
    }
  }
};
