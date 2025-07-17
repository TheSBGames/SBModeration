const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('../../utils/database');
const sendModmailLog = require('../../utils/modmailLogs');

module.exports = {
  name: 'reply',
  description: 'Reply to a modmail message',
  options: [
    {
      name: 'user',
      description: 'User to reply to',
      type: 6, // USER
      required: true
    },
    {
      name: 'message',
      description: 'Message to send',
      type: 3, // STRING
      required: true
    }
  ],
  default_member_permissions: PermissionsBitField.Flags.ManageMessages.toString(),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const messageContent = interaction.options.getString('message');

    try {
      const member = await interaction.guild.members.fetch(interaction.user.id);
      const modRoles = member.roles.cache.map(r => r.name).filter(name => name !== '@everyone');

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${interaction.user.username} (${modRoles[0] || 'Moderator'})`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setDescription(messageContent)
        .setColor('Blue')
        .setFooter({ text: `From ${interaction.guild.name}` })
        .setTimestamp();

      await user.send({ embeds: [embed] });

      await interaction.reply({ content: `📩 Replied to ${user.tag}.`, ephemeral: true });

      // Log the modmail reply
      sendModmailLog(interaction.guild, interaction.user, user, messageContent, modRoles[0] || 'Moderator');
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ Failed to send message. The user might have DMs disabled.',
        ephemeral: true
      });
    }
  }
};
