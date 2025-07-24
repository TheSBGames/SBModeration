const { ChannelType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const db = require('../../../database/guild-settings');

module.exports = {
  customId: 'welcome-menu',

  async execute(interaction) {
    const value = interaction.values[0];
    const guildId = interaction.guild.id;

    if (value === 'set-welcome-channel' || value === 'set-leave-channel') {
      const channelType = value.includes('welcome') ? 'Welcome' : 'Leave';

      const modal = new ModalBuilder()
        .setCustomId(`${value}-modal`)
        .setTitle(`Set ${channelType} Channel`);

      const input = new TextInputBuilder()
        .setCustomId('channel-id')
        .setLabel(`Enter ${channelType} Channel ID`)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('123456789012345678');

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);
      await interaction.showModal(modal);
    }

    else if (value === 'set-welcome-message' || value === 'set-leave-message') {
      const type = value.includes('welcome') ? 'Welcome' : 'Leave';

      const modal = new ModalBuilder()
        .setCustomId(`${value}-modal`)
        .setTitle(`Set ${type} Message`);

      const input = new TextInputBuilder()
        .setCustomId('message-content')
        .setLabel(`Enter ${type} Message`)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Welcome {user} to {server}!');

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);
      await interaction.showModal(modal);
    }

    else if (value === 'preview-welcome') {
      const settings = await db.get(interaction.guild.id);
      const preview = new EmbedBuilder()
        .setTitle('📥 Preview Welcome/Leave')
        .setDescription(
          `**Welcome Channel:** <#${settings.welcomeChannel || 'Not Set'}>\n` +
          `**Welcome Message:**\n${settings.welcomeMessage || 'Not Set'}\n\n` +
          `**Leave Channel:** <#${settings.leaveChannel || 'Not Set'}>\n` +
          `**Leave Message:**\n${settings.leaveMessage || 'Not Set'}`
        )
        .setColor('Blue');

      await interaction.reply({ embeds: [preview], ephemeral: true });
    }

    else if (value === 'disable-welcome') {
      await db.update(interaction.guild.id, {
        welcomeChannel: null,
        leaveChannel: null,
        welcomeMessage: null,
        leaveMessage: null,
      });

      await interaction.reply({ content: '✅ Welcome/Leave system disabled.', ephemeral: true });
    }
  }
};
