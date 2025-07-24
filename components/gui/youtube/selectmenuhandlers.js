const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = async (interaction) => {
  if (interaction.customId !== 'youtube_menu') return;

  const selected = interaction.values[0];

  if (selected === 'yt_subscribe') {
    const modal = new ModalBuilder()
      .setCustomId('yt_sub_modal')
      .setTitle('Subscribe to YouTube');

    const ytInput = new TextInputBuilder()
      .setCustomId('yt_channel_id')
      .setLabel('YouTube Channel ID')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(ytInput);
    modal.addComponents(row);
    await interaction.showModal(modal);

  } else if (selected === 'yt_unsubscribe') {
    const modal = new ModalBuilder()
      .setCustomId('yt_unsub_modal')
      .setTitle('Unsubscribe from YouTube');

    const ytInput = new TextInputBuilder()
      .setCustomId('yt_channel_id')
      .setLabel('YouTube Channel ID')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(ytInput);
    modal.addComponents(row);
    await interaction.showModal(modal);
  }
};
