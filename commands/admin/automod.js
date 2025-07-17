const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure automoderation settings.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('automod_panel')
      .setPlaceholder('Select an automod option to configure')
      .addOptions([
        { label: 'Toggle Link Filter', value: 'toggle_links' },
        { label: 'Toggle Bad Word Filter', value: 'toggle_words' },
        { label: 'Set Bypass Role', value: 'set_bypass_role' },
        { label: 'Toggle External App Detection', value: 'toggle_external_apps' }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      content: '🛡️ Use the menu below to configure automod settings:',
      components: [row],
      ephemeral: true
    });
  }
};
