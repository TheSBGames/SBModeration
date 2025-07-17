const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const db = require('../../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-gptchannel')
    .setDescription('Remove a configured ChatGPT channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to remove from ChatGPT configuration')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

  async slashExecute(interaction) {
    const channel = interaction.options.getChannel('channel');

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
      interaction.guild.ownerId !== interaction.user.id
    ) {
      return interaction.reply({ content: '❌ Only server admins/owners can remove GPT channels.', ephemeral: true });
    }

    const existing = db.get(`gpt_channels_${interaction.guild.id}`) || [];

    if (!existing.includes(channel.id)) {
      return interaction.reply({ content: `⚠️ <#${channel.id}> is not set as a GPT channel.`, ephemeral: true });
    }

    const updated = existing.filter(id => id !== channel.id);
    db.set(`gpt_channels_${interaction.guild.id}`, updated);

    interaction.reply({ content: `✅ ChatGPT has been disabled in <#${channel.id}>.`, ephemeral: true });
  }
};
