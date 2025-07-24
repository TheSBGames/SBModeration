const db = require('../../../database/guild-settings');

module.exports = async (interaction) => {
  const selected = interaction.values[0];
  await db.set(interaction.guild.id, {
    $set: { 'automod.punishment': selected }
  });

  await interaction.reply({ content: `✅ Automod punishment set to **${selected}**.`, ephemeral: true });
};
