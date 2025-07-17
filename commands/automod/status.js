const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const AutoModSettings = require('../../models/AutoModSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod-status')
    .setDescription('Check the current auto-moderation status for this server'),

  async execute(interaction) {
    const settings = await AutoModSettings.findOne({ guildId: interaction.guild.id });

    if (!settings) {
      return interaction.reply({ content: '⚠️ No AutoMod settings found for this server.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('📊 AutoMod Settings')
      .addFields(
        { name: 'Enabled', value: settings.enabled ? '✅ Yes' : '❌ No', inline: true },
        { name: 'Blocked Links', value: settings.blockLinks ? '🔗 Enabled' : '❌ Disabled', inline: true },
        { name: 'Anti External Apps', value: settings.blockExternalApps ? '🛑 On' : '❌ Off', inline: true },
        { name: 'Bypass Role', value: settings.bypassRoleId ? `<@&${settings.bypassRoleId}>` : '❌ Not set', inline: true },
        { name: 'Blocked Words', value: settings.blockedWords.length > 0 ? settings.blockedWords.join(', ') : 'None' }
      )
      .setColor('#ffcc00');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
