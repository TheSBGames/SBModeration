const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket-transcript')
      .setLabel('📄 Save Transcript')
      .setStyle(ButtonStyle.Primary)
  ),
};
