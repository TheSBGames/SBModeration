const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  createStatusModal() {
    const modal = new ModalBuilder()
      .setCustomId('admin-status-modal')
      .setTitle('Set Bot Status');

    const statusText = new TextInputBuilder()
      .setCustomId('statusText')
      .setLabel('Status Message')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(statusText));
    return modal;
  },

  createActivityTypeSelectMenu() {
    return new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select-activity-type')
        .setPlaceholder('Choose activity type...')
        .addOptions([
          { label: 'Playing', value: 'Playing' },
          { label: 'Streaming', value: 'Streaming' },
          { label: 'Listening', value: 'Listening' },
          { label: 'Watching', value: 'Watching' },
          { label: 'Competing', value: 'Competing' }
        ])
    );
  }
};
