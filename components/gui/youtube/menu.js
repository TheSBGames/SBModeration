const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  buildYouTubeMenu() {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('youtube_menu')
      .setPlaceholder('📺 Manage YouTube Notifications')
      .addOptions([
        {
          label: 'Subscribe to a Channel',
          value: 'yt_subscribe',
          emoji: '🔔'
        },
        {
          label: 'Unsubscribe from a Channel',
          value: 'yt_unsubscribe',
          emoji: '🔕'
        }
      ]);

    return new ActionRowBuilder().addComponents(menu);
  }
};
