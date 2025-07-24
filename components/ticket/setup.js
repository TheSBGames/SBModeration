const { PermissionFlagsBits } = require('discord.js');
const panel = require('./panel.js');

module.exports = {
  name: 'ticketSetup',
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: 'You need to be an administrator to set up the ticket panel.',
        ephemeral: true,
      });
    }

    await panel.sendPanel(interaction.channel);
    interaction.reply({ content: '✅ Ticket panel sent!', ephemeral: true });
  },
};
