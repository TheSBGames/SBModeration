const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole-panel')
    .setDescription('Configure autorole settings (GUI panel)')
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ You need Administrator permission.', ephemeral: true });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('autorole_setup')
      .setPlaceholder('Select a setting to configure')
      .addOptions([
        {
          label: 'Enable/Disable Autorole',
          value: 'toggle_autorole',
        },
        {
          label: 'Set Human Role',
          value: 'set_human_role',
        },
        {
          label: 'Set Bot Role',
          value: 'set_bot_role',
        },
        {
          label: 'Clear Autorole Settings',
          value: 'clear_autorole',
        }
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      content: '🔧 Configure the Autorole System using the select menu below:',
      components: [row],
      ephemeral: true,
    });
  },
};
