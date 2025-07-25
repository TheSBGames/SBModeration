const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../../database/guild-settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settranscript')
    .setDescription('Set the transcript log channel for tickets.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Transcript channel')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    await GuildSettings.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { transcriptChannelId: channel.id } },
      { upsert: true }
    );

    await interaction.reply({ content: `✅ Transcript channel set to ${channel}`, ephemeral: true });
  }
};
