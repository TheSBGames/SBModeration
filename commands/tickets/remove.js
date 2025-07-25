const { SlashCommandBuilder } = require('discord.js');
const TicketPanel = require('../../database/ticket/TicketPanel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-remove')
    .setDescription('Remove a ticket panel for this server')
    .addStringOption(option =>
      option.setName('panel_id')
        .setDescription('ID of the panel to remove')
        .setRequired(true)
    ),

  async execute(interaction) {
    const panelId = interaction.options.getString('panel_id');

    const removed = await TicketPanel.findOneAndDelete({ guildId: interaction.guild.id, panelId });
    if (!removed) {
      return interaction.reply({ content: `❌ No panel found with ID \`${panelId}\`.`, ephemeral: true });
    }

    return interaction.reply({ content: `✅ Successfully removed panel with ID \`${panelId}\`.`, ephemeral: true });
  }
};
