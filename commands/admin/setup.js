const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { showMainSetupMenu } = require('../../gui/menu');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Launch the interactive setup menu')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await showMainSetupMenu(interaction);
  }
};
