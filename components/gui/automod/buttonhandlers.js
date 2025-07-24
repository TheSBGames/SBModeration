const { updateGuildSetting } = require('../../../database/guild-settings');

module.exports = {
  async handleAutomodButtons(interaction) {
    const { customId, guildId } = interaction;
    const currentCategory = interaction.message.components[0].components[0].data.default?.value || null;

    if (!currentCategory) {
      return interaction.reply({ content: 'Please select a category first using the menu.', ephemeral: true });
    }

    const settingPath = `automod.${currentCategory}.enabled`;

    if (customId === 'automod-enable') {
      await updateGuildSetting(guildId, settingPath, true);
      return interaction.reply({ content: `✅ ${currentCategory} filter enabled!`, ephemeral: true });
    }

    if (customId === 'automod-disable') {
      await updateGuildSetting(guildId, settingPath, false);
      return interaction.reply({ content: `❌ ${currentCategory} filter disabled!`, ephemeral: true });
    }

    if (customId === 'automod-action') {
      return interaction.reply({
        content: 'Please choose an action (Timeout, Mute, Kick, Ban) from the menu.',
        components: [
          new interaction.client.discord.ActionRowBuilder().addComponents(
            new interaction.client.discord.StringSelectMenuBuilder()
              .setCustomId('automod-action-select')
              .setPlaceholder('Select punishment action')
              .addOptions(['timeout', 'mute', 'kick', 'ban'].map(action => ({
                label: action.charAt(0).toUpperCase() + action.slice(1),
                value: action
              })))
          )
        ],
        ephemeral: true
      });
    }
  }
};
