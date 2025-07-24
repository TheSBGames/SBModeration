const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendYoutubeConfigMenu } = require('../../components/youtube/menu');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtubeconfig')
    .setDescription('Open YouTube notifier config menu (GUI)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  run: async (client, interaction) => {
    await sendYoutubeConfigMenu(interaction);
  }
};
