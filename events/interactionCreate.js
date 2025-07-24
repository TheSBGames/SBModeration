const { Events, InteractionType, PermissionFlagsBits } = require('discord.js');
const handleSelectMenus = require('../components/handlers/selectMenuHandlers');
const handleButtonInteractions = require('../components/handlers/buttonHandlers');
const { hasNoPrefixAccess } = require('../utils/noprefix');
const { clientId } = require('../config.json');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    // SLASH COMMANDS
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Permissions check
      if (
        command.userPermissions &&
        !interaction.member.permissions.has(command.userPermissions)
      ) {
        return interaction.reply({
          content: '🚫 You don’t have permission to use this command.',
          ephemeral: true,
        });
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '❌ An error occurred while executing this command!',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: '❌ An error occurred while executing this command!',
            ephemeral: true,
          });
        }
      }
    }

    // CONTEXT MENUS
    if (interaction.isContextMenuCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    }

    // BUTTONS
    if (interaction.isButton()) {
      try {
        await handleButtonInteractions(interaction, client);
      } catch (err) {
        console.error('Button error:', err);
      }
    }

    // SELECT MENUS
    if (interaction.isStringSelectMenu()) {
      try {
        await handleSelectMenus(interaction, client);
      } catch (err) {
        console.error('Select menu error:', err);
      }
    }

    // MODAL SUBMITS (optional)
    if (interaction.type === InteractionType.ModalSubmit) {
      // handle modals if you have any
    }

    // AUTOCOMPLETE
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (!command || !command.autocomplete) return;
      try {
        await command.autocomplete(interaction, client);
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    }
  },
};
