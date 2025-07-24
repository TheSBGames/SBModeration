const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ytDB = require('../../database/youtube-schema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtube-subscribe')
    .setDescription('Subscribe to a YouTube channel to receive notifications.')
    .addStringOption(opt =>
      opt.setName('channel_id')
        .setDescription('The YouTube channel ID (not the link).')
        .setRequired(true)
    )
    .addChannelOption(opt =>
      opt.setName('notify_channel')
        .setDescription('The channel where notifications will be sent.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const channelId = interaction.options.getString('channel_id');
    const notifyChannel = interaction.options.getChannel('notify_channel');

    await ytDB.findOneAndUpdate(
      { guildId: interaction.guild.id, channelId },
      {
        guildId: interaction.guild.id,
        channelId,
        notifyChannelId: notifyChannel.id
      },
      { upsert: true }
    );

    await interaction.reply({
      content: `✅ Subscribed to YouTube channel \`${channelId}\` and will notify in ${notifyChannel}.`,
      ephemeral: true
    });
  }
};
