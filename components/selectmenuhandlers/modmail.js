const { ChannelSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = async (interaction, client) => {
  const { values, guildId } = interaction;
  const selected = values[0];
  const GuildSettings = require('../../../database/guild-settings');

  if (selected === 'set_category') {
    const row = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('modmail_category_select')
        .setPlaceholder('Choose a category')
        .addChannelTypes(4) // GUILD_CATEGORY
    );
    return interaction.update({
      content: '📁 Select the category where ModMail threads will be created:',
      components: [row]
    });

  } else if (selected === 'set_log_channel') {
    const row = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('modmail_logchannel_select')
        .setPlaceholder('Select log channel')
        .addChannelTypes(0) // GUILD_TEXT
    );
    return interaction.update({
      content: '📝 Choose the channel where replies will be logged:',
      components: [row]
    });

  } else if (selected === 'disable') {
    await GuildSettings.findOneAndUpdate({ guildId }, {
      $set: { modmailCategoryId: null, modmailLogChannelId: null }
    });
    return interaction.update({
      content: '❌ ModMail has been disabled for this server.',
      components: []
    });
  }
};
