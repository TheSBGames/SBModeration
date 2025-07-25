const { Events, InteractionType } = require('discord.js');
const config = require('../config.json');
const log = require('../utils/logger.js');

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction, client) {
    try {
      // ===== Slash Commands =====
      if (interaction.isChatInputCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        return command.execute(interaction, client);
      }

      // ===== Context Menus =====
      if (interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        return command.execute(interaction, client);
      }

      // ===== Buttons =====
      if (interaction.isButton()) {
        const id = interaction.customId;

        if (id.startsWith('ticket_')) {
          return require('../components/buttonhandlers/ticket')(interaction, client);
        }

        if (id === 'automod_setup') {
          return require('../components/buttonhandlers/automod')(interaction, client);
        }

        if (id === 'ticket_panel_create') {
          return require('../components/buttonhandlers/ticketPanel')(interaction, client);
        }

        if (id === 'transcript_confirm') {
          return require('../components/buttonhandlers/ticketTranscript')(interaction, client);
        }

        if (id === 'close_ticket') {
          return require('../components/buttonhandlers/ticketClose')(interaction, client);
        }

        // Add more buttons here as needed
      }

      // ===== Select Menus =====
      if (interaction.isStringSelectMenu()) {
        const id = interaction.customId;

        // ModMail Setup Menu
        if (id === 'modmail_setup_menu') {
          return require('../components/selectmenuhandlers/modmail')(interaction, client);
        }

        if (id === 'modmail_category_select') {
          return require('../components/selectmenuhandlers/modmailCategory')(interaction);
        }

        if (id === 'modmail_logchannel_select') {
          return require('../components/selectmenuhandlers/modmailLogChannel')(interaction);
        }

        // Automod Setup
        if (id === 'automod_setup_menu') {
          return require('../components/selectmenuhandlers/automod')(interaction, client);
        }

        if (id === 'automod_filter_type') {
          return require('../components/selectmenuhandlers/automodFilterType')(interaction);
        }

        // Ticket Category Setup
        if (id === 'ticket_category_select') {
          return require('../components/selectmenuhandlers/ticketCategory')(interaction);
        }

        // Add more select menus as needed
      }

      // ===== Modal Submissions =====
      if (interaction.type === InteractionType.ModalSubmit) {
        const id = interaction.customId;

        if (id === 'modmail_modal') {
          return require('../components/modalhandlers/modmail')(interaction, client);
        }

        if (id === 'embed_create_modal') {
          return require('../components/modalhandlers/embedMessage')(interaction, client);
        }

        // Add more modals here
      }

    } catch (error) {
      console.error(`[Interaction Error]`, error);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: '❌ Something went wrong while executing this interaction.', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Something went wrong.', ephemeral: true });
      }

      // Log to console or a log channel
      log.error('Interaction Error:', error);
    }
  }
};
