const {
  Events,
  InteractionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');

const modmailHandlers = require('../utils/modmail-interactions');
const ticketHandlers = require('../utils/ticket-interactions');
const autoroleHandlers = require('../utils/autorole-interactions');
const autoresponderHandlers = require('../utils/autoresponder-interactions');
const automodHandlers = require('../utils/automod-interactions');

module.exports = {
  name: Events.InteractionCreate,
  
  async execute(interaction, client) {
    try {
      // 💬 Slash Commands
      if (interaction.isChatInputCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        // Owner-only command (e.g. /setstatus)
        if (command.ownerOnly && interaction.user.id !== '1186506712040099850') {
          return interaction.reply({ content: "❌ Only the bot owner can use this command.", ephemeral: true });
        }

        // Permission check
        if (
          command.permissions &&
          !interaction.member.permissions.has(command.permissions)
        ) {
          return interaction.reply({ content: "🚫 You don't have permission to use this command.", ephemeral: true });
        }

        await command.execute(interaction, client);
      }

      // 🔘 Button Interactions
      else if (interaction.isButton()) {
        // Handle ticket system buttons
        if (interaction.customId.startsWith('ticket_')) {
          await ticketHandlers.handle(interaction, client);
        }

        // Handle modmail close button
        else if (interaction.customId.startsWith('modmail_close')) {
          await modmailHandlers.handleClose(interaction, client);
        }

        // Autorole GUI
        else if (interaction.customId.startsWith('autorole_')) {
          await autoroleHandlers.handle(interaction, client);
        }

        // Autoresponder GUI
        else if (interaction.customId.startsWith('autoresponder_')) {
          await autoresponderHandlers.handle(interaction, client);
        }

        // Automod GUI
        else if (interaction.customId.startsWith('automod_')) {
          await automodHandlers.handle(interaction, client);
        }
      }

      // 📥 Select Menu Interactions
      else if (interaction.isStringSelectMenu()) {
        if (interaction.customId.startsWith('autorole_select')) {
          await autoroleHandlers.handleSelect(interaction, client);
        }

        else if (interaction.customId.startsWith('autoresponder_select')) {
          await autoresponderHandlers.handleSelect(interaction, client);
        }

        else if (interaction.customId.startsWith('automod_select')) {
          await automodHandlers.handleSelect(interaction, client);
        }
      }

      // 🧩 Modal / Context / Autocomplete (optional handling)
      // Add here if needed in future

    } catch (err) {
      console.error(`[Interaction Error]`, err);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: '❌ An error occurred while handling this interaction.',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: '❌ An error occurred while handling this interaction.',
          ephemeral: true,
        });
      }
    }
  },
};
