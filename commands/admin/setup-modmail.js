const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ChannelType, ChannelSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupmodmail')
    .setDescription('Configure ModMail system')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('modmail_setup_menu')
        .setPlaceholder('Select an option to configure')
        .addOptions([
          {
            label: 'Set ModMail Category',
            value: 'set_category',
            description: 'Where ModMail channels will be created'
          },
          {
            label: 'Set ModMail Log Channel',
            value: 'set_log_channel',
            description: 'Where ModMail replies will be logged'
          },
          {
            label: 'Disable ModMail',
            value: 'disable',
            description: 'Turn off ModMail system for this server'
          }
        ])
    );

    await interaction.reply({
      content: '🛠 Select a ModMail setting to configure:',
      components: [row],
      ephemeral: true
    });
  }
};
