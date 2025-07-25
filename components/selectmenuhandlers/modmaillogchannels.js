const GuildSettings = require('../../../database/guild-settings');

module.exports = async (interaction) => {
  const channel = interaction.values[0];
  await GuildSettings.findOneAndUpdate({ guildId: interaction.guildId }, {
    $set: { modmailLogChannelId: channel }
  });

  await interaction.update({
    content: `📝 ModMail log channel set to <#${channel}>`,
    components: []
  });
};
