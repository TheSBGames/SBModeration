const db = require('../../../database/guild-settings');

module.exports = async (interaction) => {
  const selected = interaction.values;
  const config = {
    antiLink: selected.includes('antiLink'),
    antiInvite: selected.includes('antiInvite'),
    antiBadwords: selected.includes('antiBadwords'),
    antiSpam: selected.includes('antiSpam'),
    antiExternalApps: {
      enabled: selected.includes('antiExternalApps'),
      action: 'kick'
    }
  };

  await db.set(interaction.guild.id, {
    $set: {
      'automod.antiLink': config.antiLink,
      'automod.antiInvite': config.antiInvite,
      'automod.antiBadwords': config.antiBadwords,
      'automod.antiSpam': config.antiSpam,
      'automod.antiExternalApps': config.antiExternalApps
    }
  });

  await interaction.reply({ content: "✅ Automod filters updated.", ephemeral: true });
};
