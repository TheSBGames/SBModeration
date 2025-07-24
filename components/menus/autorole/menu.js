const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../../../models/guild-settings');

module.exports = async (interaction, client) => {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.reply({ content: '❌ You do not have permission to manage the server.', ephemeral: true });
  }

  const guildId = interaction.guild.id;
  const userId = interaction.user.id;
  const customId = interaction.customId;

  let settings = await GuildSettings.findOne({ guildId });
  if (!settings) {
    settings = new GuildSettings({ guildId });
    await settings.save();
  }

  const isButton = interaction.isButton();
  const isMenu = interaction.isStringSelectMenu();

  // Handle enable/disable autorole
  if (isButton && customId === 'autorole_toggle') {
    settings.autorole.enabled = !settings.autorole.enabled;
    await settings.save();

    return interaction.update({
      embeds: [
        new EmbedBuilder()
          .setTitle('Autorole System')
          .setDescription(`✅ Autorole is now **${settings.autorole.enabled ? 'Enabled' : 'Disabled'}**.`)
          .setColor('Green'),
      ],
      components: [getMainComponents(settings)],
    });
  }

  // Handle role selection menu
  if (isMenu && customId === 'autorole_selector') {
    const [roleType] = interaction.values;

    const roleSelectionMenu = new StringSelectMenuBuilder()
      .setCustomId(`autorole_setrole_${roleType}`)
      .setPlaceholder('Select a role')
      .addOptions(
        interaction.guild.roles.cache
          .filter(role => role.editable && !role.managed)
          .map(role => ({
            label: role.name,
            value: role.id,
          }))
          .slice(0, 25)
      );

    const row = new ActionRowBuilder().addComponents(roleSelectionMenu);
    return interaction.reply({ content: `Select a role to assign for **${roleType}**:`, components: [row], ephemeral: true });
  }

  // Handle actual role selection (set role)
  if (isMenu && customId.startsWith('autorole_setrole_')) {
    const type = customId.split('_')[2];
    const roleId = interaction.values[0];

    if (type === 'human') settings.autorole.humanRole = roleId;
    if (type === 'bot') settings.autorole.botRole = roleId;

    await settings.save();

    return interaction.update({
      content: `✅ ${type === 'human' ? 'Human' : 'Bot'} role set to <@&${roleId}>.`,
      components: [],
    });
  }

  // Main GUI panel (initial load or refresh)
  if (isButton && customId === 'autorole_config') {
    return interaction.update({
      embeds: [
        new EmbedBuilder()
          .setTitle('Autorole Setup')
          .setDescription('Manage your autorole settings below.')
          .addFields(
            { name: 'Status', value: settings.autorole.enabled ? '🟢 Enabled' : '🔴 Disabled', inline: true },
            { name: 'Human Role', value: settings.autorole.humanRole ? `<@&${settings.autorole.humanRole}>` : 'Not Set', inline: true },
            { name: 'Bot Role', value: settings.autorole.botRole ? `<@&${settings.autorole.botRole}>` : 'Not Set', inline: true }
          )
          .setColor('Blue'),
      ],
      components: [getMainComponents(settings)],
    });
  }

  // Fallback
  return interaction.reply({ content: '❌ Unknown interaction in Autorole.', ephemeral: true });
};

function getMainComponents(settings) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('autorole_toggle')
      .setLabel(settings.autorole.enabled ? 'Disable' : 'Enable')
      .setStyle(settings.autorole.enabled ? ButtonStyle.Danger : ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('autorole_config')
      .setLabel('Refresh Panel')
      .setStyle(ButtonStyle.Secondary),

    new StringSelectMenuBuilder()
      .setCustomId('autorole_selector')
      .setPlaceholder('Select Human/Bot Role')
      .addOptions([
        {
          label: 'Set Human Role',
          value: 'human',
        },
        {
          label: 'Set Bot Role',
          value: 'bot',
        },
      ])
  );
}
