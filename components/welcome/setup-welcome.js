const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, PermissionsBitField } = require('discord.js');
const db = require('../../database/guild-settings');

module.exports = {
  id: 'setup-welcome',
  permissions: [PermissionsBitField.Flags.Administrator],

  async execute(interaction) {
    const guildId = interaction.guild.id;

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('welcome-menu')
        .setPlaceholder('Configure Welcome/Leave Messages')
        .addOptions([
          { label: 'Set Welcome Channel', value: 'set-welcome-channel' },
          { label: 'Set Leave Channel', value: 'set-leave-channel' },
          { label: 'Set Welcome Message', value: 'set-welcome-message' },
          { label: 'Set Leave Message', value: 'set-leave-message' },
          { label: 'Preview Messages', value: 'preview-welcome' },
          { label: 'Disable Welcome System', value: 'disable-welcome' }
        ])
    );

    const embed = new EmbedBuilder()
      .setTitle('Welcome/Leave System Setup')
      .setDescription('Select a setting below to configure your server’s welcome or leave messages.')
      .setColor('Blue');

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
