const GuildSettings = require('../../../database/guild-settings');

module.exports = async (interaction) => {
  const category = interaction.values[0];
  await GuildSettings.findOneAndUpdate({ guildId: interaction.guildId }, {
    $set: { modmailCategoryId: category }
  });

  await interaction.update({
    content: `📁 ModMail category set to <#${category}>`,
    components: []
  });
};
