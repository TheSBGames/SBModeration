const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ComponentType,
  ChannelType
} = require('discord.js');
const YoutubeSettings = require('../../database/youtube-settings');

module.exports = {
  async sendYoutubeConfigMenu(interaction) {
    const existing = await YoutubeSettings.findOne({ guildId: interaction.guild.id });

    const embed = new EmbedBuilder()
      .setTitle('📢 YouTube Notifier Configuration')
      .setDescription('Use the menu below to manage YouTube channel notifications.\n\n' +
        (existing
          ? `**Current YouTube Channel ID:** \`${existing.youtubeChannelId}\`\n**Notification Channel:** <#${existing.channelId}>`
          : 'No notifier is configured yet.'))
      .setColor('#FF0000')
      .setFooter({ text: 'SB Moderation • YouTube Notifier' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('youtube_config_menu')
      .setPlaceholder('Choose an action')
      .addOptions(
        {
          label: 'Set YouTube Channel ID',
          value: 'set_channel_id',
          emoji: '🎥'
        },
        {
          label: 'Set Notification Channel',
          value: 'set_notify_channel',
          emoji: '🔔'
        },
        {
          label: 'Disable Notifier',
          value: 'disable_notifier',
          emoji: '🛑'
        }
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  },

  async handleYoutubeMenu(interaction, client) {
    const selected = interaction.values[0];

    if (selected === 'set_channel_id') {
      await interaction.reply({ content: 'Please enter the **YouTube Channel ID** to monitor:', ephemeral: true });

      const collector = interaction.channel.createMessageCollector({
        filter: m => m.author.id === interaction.user.id,
        max: 1,
        time: 15000
      });

      collector.on('collect', async msg => {
        await YoutubeSettings.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { youtubeChannelId: msg.content },
          { upsert: true }
        );
        await msg.reply('✅ YouTube Channel ID saved.');
      });

    } else if (selected === 'set_notify_channel') {
      await interaction.reply({ content: 'Please mention the channel to send notifications in (e.g. #updates):', ephemeral: true });

      const collector = interaction.channel.createMessageCollector({
        filter: m => m.author.id === interaction.user.id,
        max: 1,
        time: 15000
      });

      collector.on('collect', async msg => {
        const mentioned = msg.mentions.channels.first();
        if (!mentioned || mentioned.type !== ChannelType.GuildText) {
          return msg.reply('⚠️ Please mention a valid text channel.');
        }

        await YoutubeSettings.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { channelId: mentioned.id },
          { upsert: true }
        );

        await msg.reply(`✅ Notification channel set to <#${mentioned.id}>.`);
      });

    } else if (selected === 'disable_notifier') {
      await YoutubeSettings.deleteOne({ guildId: interaction.guild.id });
      await interaction.reply({ content: '🛑 YouTube notifier disabled for this server.', ephemeral: true });
    }
  }
};
