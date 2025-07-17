const AutoModSettings = require('../models/AutoModSettings');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isStringSelectMenu()) return;

    const { customId, values, guildId, member, guild } = interaction;
    if (customId !== 'automod_setup_select') return;

    if (!member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ You need Administrator permission to use this menu.', ephemeral: true });
    }

    const selected = values[0];

    let settings = await AutoModSettings.findOne({ guildId });
    if (!settings) {
      settings = new AutoModSettings({ guildId });
    }

    switch (selected) {
      case 'toggle_automod':
        settings.enabled = !settings.enabled;
        await settings.save();
        return interaction.reply({ content: `✅ AutoMod is now **${settings.enabled ? 'Enabled' : 'Disabled'}**.`, ephemeral: true });

      case 'block_links':
        settings.blockLinks = !settings.blockLinks;
        await settings.save();
        return interaction.reply({ content: `🔗 Block Links is now **${settings.blockLinks ? 'Enabled' : 'Disabled'}**.`, ephemeral: true });

      case 'block_external_apps':
        settings.blockExternalApps = !settings.blockExternalApps;
        await settings.save();
        return interaction.reply({ content: `🚫 Anti-External Apps is now **${settings.blockExternalApps ? 'Enabled' : 'Disabled'}**.`, ephemeral: true });

      case 'bypass_role':
        return interaction.reply({
          content: 'Please mention the bypass role (e.g., @trusted) within 30 seconds.',
          ephemeral: true
        }).then(() => {
          const filter = m => m.mentions.roles.size > 0 && m.author.id === interaction.user.id;
          const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

          collector.on('collect', async m => {
            const role = m.mentions.roles.first();
            settings.bypassRoleId = role.id;
            await settings.save();
            m.reply({ content: `✅ Bypass role set to ${role}.`, ephemeral: true });
          });

          collector.on('end', collected => {
            if (!collected.size) interaction.followUp({ content: '⏱️ No role mentioned in time.', ephemeral: true });
          });
        });

      case 'blocked_words':
        return interaction.reply({
          content: 'Please send the list of blocked words separated by commas (e.g., badword1,badword2):',
          ephemeral: true
        }).then(() => {
          const filter = m => m.author.id === interaction.user.id;
          const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

          collector.on('collect', async m => {
            const words = m.content.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
            settings.blockedWords = words;
            await settings.save();
            m.reply({ content: `✅ Blocked words updated.`, ephemeral: true });
          });

          collector.on('end', collected => {
            if (!collected.size) interaction.followUp({ content: '⏱️ No input received.', ephemeral: true });
          });
        });

      case 'set_timeout':
      case 'set_mute':
      case 'set_kick':
      case 'set_ban':
        return interaction.reply({
          content: `Please enter the punishment duration (e.g., 10m, 1h, or "off" to disable ${selected.replace('set_', '')}).`,
          ephemeral: true
        }).then(() => {
          const filter = m => m.author.id === interaction.user.id;
          const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

          collector.on('collect', async m => {
            const input = m.content.toLowerCase();
            const key = selected.replace('set_', '') + 'Action';

            if (input === 'off') {
              settings[key] = null;
              await settings.save();
              return m.reply({ content: `❌ ${selected.replace('set_', '')} action disabled.`, ephemeral: true });
            }

            settings[key] = input;
            await settings.save();
            m.reply({ content: `✅ Action set for ${selected.replace('set_', '')}: ${input}`, ephemeral: true });
          });

          collector.on('end', collected => {
            if (!collected.size) interaction.followUp({ content: '⏱️ No input received.', ephemeral: true });
          });
        });

      default:
        return interaction.reply({ content: '❌ Unknown selection.', ephemeral: true });
    }
  }
};
