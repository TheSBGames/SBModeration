const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 Autoresponder Setup Panel')
      .setDescription('Manage your server\'s autoresponders. Select an option from the menu below.')
      .setColor('#2B2D31');

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('autoresponder-config-menu')
      .setPlaceholder('Choose an autoresponder action')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Add Autoresponder')
          .setValue('add-responder')
          .setDescription('Create a new autoresponse'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Remove Autoresponder')
          .setValue('remove-responder')
          .setDescription('Delete an existing autoresponse'),
        new StringSelectMenuOptionBuilder()
          .setLabel('List Autoresponders')
          .setValue('list-responders')
          .setDescription('Show all current autoresponses')
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
