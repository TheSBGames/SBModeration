const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-autoresponder')
    .setDescription('Set up autoresponder system')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('autoresponder_setup')
      .setPlaceholder('Choose an option')
      .addOptions([
        { label: '➕ Add Autoresponder', value: 'add' },
        { label: '➖ Remove Autoresponder', value: 'remove' },
        { label: '📃 View All', value: 'view' },
        { label: '🔁 Toggle Autoresponder', value: 'toggle' }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      content: '🧠 Use the dropdown below to configure the autoresponder system:',
      components: [row],
      ephemeral: true
    });
  }
};
