const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('confirm-close')
      .setLabel('Yes, close it')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('cancel-close')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
  ),
};
