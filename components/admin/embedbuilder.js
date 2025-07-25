const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  createEmbedModal() {
    const modal = new ModalBuilder()
      .setCustomId('admin-embed-modal')
      .setTitle('Create Embed');

    const title = new TextInputBuilder()
      .setCustomId('embedTitle')
      .setLabel('Embed Title')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const description = new TextInputBuilder()
      .setCustomId('embedDescription')
      .setLabel('Embed Description')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const footer = new TextInputBuilder()
      .setCustomId('embedFooter')
      .setLabel('Footer (optional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const color = new TextInputBuilder()
      .setCustomId('embedColor')
      .setLabel('Embed Color (hex)')
      .setPlaceholder('#5865F2')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(title),
      new ActionRowBuilder().addComponents(description),
      new ActionRowBuilder().addComponents(footer),
      new ActionRowBuilder().addComponents(color)
    );

    return modal;
  },

  createEmbedControlButtons() {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('embed-confirm')
        .setLabel('Send')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('embed-cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger)
    );
  }
};
