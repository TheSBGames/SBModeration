const { EmbedBuilder } = require('discord.js');
const ticketMenu = require('./menu.js');

module.exports = {
  sendPanel: async (channel) => {
    const embed = new EmbedBuilder()
      .setTitle('🎫 Create a Ticket')
      .setDescription('Select a category from the menu below to open a ticket with our team.')
      .setColor(0x00bfff);

    await channel.send({
      embeds: [embed],
      components: [ticketMenu.data],
    });
  },
};
