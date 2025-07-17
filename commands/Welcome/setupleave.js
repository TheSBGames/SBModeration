const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const WelcomeSettings = require('../../models/WelcomeSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupleave')
    .setDescription('Set up the leave message system for your server')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel where leave messages will be sent')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Leave message (use {user}, {server}, {memberCount})')
        .setRequired(true)
    ),

  async slashExecute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: '❌ You need the Manage Server permission.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');

    await WelcomeSettings.findOneAndUpdate(
      { guildId: interaction.guild.id },
      {
        guildId: interaction.guild.id,
        leaveChannelId: channel.id,
        leaveMessage: message
      },
      { upsert: true }
    );

    interaction.reply({
      content: '✅ Leave message system configured!',
      ephemeral: true
    });
  }
};
