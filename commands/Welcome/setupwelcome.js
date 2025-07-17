const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const WelcomeSettings = require('../../models/WelcomeSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupwelcome')
    .setDescription('Set up the welcome system for your server')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel where welcome messages will be sent')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Welcome message (use {user}, {server}, {memberCount})')
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
        welcomeChannelId: channel.id,
        welcomeMessage: message
      },
      { upsert: true }
    );

    interaction.reply({
      content: '✅ Welcome system set up successfully!',
      ephemeral: true
    });
  }
};
