const { updateGuildSetting } = require('../../../database/guild-settings');

module.exports = {
  async handleAutomodSelectMenus(interaction) {
    const { customId, values, guildId } = interaction;

    if (customId === 'automod-select-menu') {
      const selected = values[0];
      return interaction.reply({
        content: `You selected **${selected}**. Now use the buttons below to configure.`,
        ephemeral: true
      });
    }

    if (customId === 'automod-action-select') {
      const selectedAction = values[0];
      const currentCategory = interaction.message.reference?.message?.components[0]?.components[0]?.data?.default?.value;

      if (!currentCategory) {
        return interaction.reply({ content: 'Cannot determine which filter to apply this action to.', ephemeral: true });
      }

      const settingPath = `automod.${currentCategory}.punishment`;
      await updateGuildSetting(guildId, settingPath, selectedAction);
      return interaction.reply({ content: `✅ Action set to **${selectedAction}** for **${currentCategory}** filter.`, ephemeral: true });
    }
  }
};
