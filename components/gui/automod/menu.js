const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  async sendAutomodMenu(interaction, settings) {
    const embed = new EmbedBuilder()
      .setTitle('🛡️ Automod Configuration')
      .setDescription('Use the dropdown and buttons below to configure the automoderation system for this server.')
      .setColor('#2B2D31');

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('automod-select-menu')
      .setPlaceholder('Choose an automod category to configure')
      .addOptions([
        { label: 'Bad Words Filter', value: 'badwords' },
        { label: 'Link Filter', value: 'links' },
        { label: 'Spam Filter', value: 'spam' },
        { label: 'External App Filter', value: 'externalapps' },
        { label: 'Set Bypass Role', value: 'bypassrole' },
      ]);

    const row1 = new ActionRowBuilder().addComponents(selectMenu);

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('automod-enable')
        .setLabel('Enable')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('automod-disable')
        .setLabel('Disable')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('automod-action')
        .setLabel('Set Punishment')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row1, row2],
      ephemeral: true
    });
  }
};
