const embedBuilder = require('./embedBuilder.js');
const statusBuilder = require('./setStatus.js');

module.exports = {
  async handleAdminSelectMenus(interaction) {
    const value = interaction.values[0];

    if (value === 'create-embed') {
      const modal = embedBuilder.createEmbedModal();
      return interaction.showModal(modal);
    }

    if (value === 'set-status') {
      const menu = statusBuilder.createActivityTypeSelectMenu();
      return interaction.reply({ components: [menu], ephemeral: true });
    }
  }
};
