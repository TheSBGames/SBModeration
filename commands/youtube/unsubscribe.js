const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ytDB = require('../../database/youtube-schema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtube-unsubscribe')
    .setDescription('Unsubscribe from a YouTube channel.')
    .addStringOption(opt =>
      opt.setName('channel_id')
        .setDescription('The YouTube channel ID you want to unsubscribe from.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const channelId = interaction.options.getString('channel_id');

    const removed = await ytDB.findOneAndDelete({
      guildId: interaction.guild.id,
      channelId
    });

    if (!removed) {
      return interaction.reply({
        content: `❌ No subscription found for \`${channelId}\`.`,
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `✅ Unsubscribed from YouTube channel \`${channelId}\`.`,
      ephemeral: true
    });
  }
};
