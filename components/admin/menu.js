const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  createAdminMenu() {
    return new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('admin-menu')
        .setPlaceholder('⚙️ Choose an Admin Tool')
        .addOptions([
          {
            label: 'Create Embed',
            value: 'create-embed',
            description: 'Send a custom embed message'
          },
          {
            label: 'Set Bot Status',
            value: 'set-status',
            description: 'Change bot status (owner only)'
          }
        ])
    );
  }
};
