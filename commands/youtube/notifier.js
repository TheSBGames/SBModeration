const { SlashCommandBuilder } = require('discord.js');
const YoutubeSettings = require('../../database/youtube-settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ytnotify')
    .setDescription('Setup YouTube upload notifications for a channel')
    .addStringOption(opt => opt.setName('youtube_channel_id').setDescription('YouTube Channel ID').setRequired(true))
    .addChannelOption(opt => opt.setName('discord_channel').setDescription('Notification channel').setRequired(true)),
  
  run: async (client, interaction) => {
    const youtubeChannelId = interaction.options.getString('youtube_channel_id');
    const discordChannel = interaction.options.getChannel('discord_channel');

    await YoutubeSettings.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { channelId: discordChannel.id, youtubeChannelId },
      { upsert: true }
    );

    return interaction.reply({ content: `✅ YouTube notifier set for <#${discordChannel.id}>`, ephemeral: true });
  }
};
