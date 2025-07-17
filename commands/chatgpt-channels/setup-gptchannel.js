const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const db = require('../../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-gptchannel')
    .setDescription('Set a channel where users can talk with ChatGPT directly (no prefix required)')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select the channel to use as ChatGPT channel')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

  async slashExecute(interaction) {
    const channel = interaction.options.getChannel('channel');

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
      interaction.guild.ownerId !== interaction.user.id
    ) {
      return interaction.reply({ content: '❌ Only server admins/owners can configure ChatGPT channels.', ephemeral: true });
    }

    const existing = db.get(`gpt_channels_${interaction.guild.id}`) || [];

    if (existing.includes(channel.id)) {
      return interaction.reply({ content: `⚠️ <#${channel.id}> is already set as a GPT channel.`, ephemeral: true });
    }

    existing.push(channel.id);
    db.set(`gpt_channels_${interaction.guild.id}`, existing);

    interaction.reply({ content: `✅ ChatGPT has been enabled in <#${channel.id}>. Users can talk with the bot directly.`, ephemeral: true });
  }
};
