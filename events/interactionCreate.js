const { Events, PermissionsBitField, InteractionType } = require('discord.js');
const AutoModSettings = require('../models/AutoMod');
const AutoRoleSettings = require('../models/AutoRole');
const AutoResponder = require('../models/AutoResponder');
const TicketSettings = require('../models/TicketSettings');
const ModMailSettings = require('../models/ModMailSettings');
const ChatGPTChannel = require('../models/ChatGPTChannel');
const { generateGPTReply } = require('../utils/chatgpt');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    try {
      // --------- SLASH COMMANDS ---------
      if (interaction.isChatInputCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        // Owner-only commands (e.g., /setstatus)
        if (command.ownerOnly && interaction.user.id !== '1186506712040099850') {
          return interaction.reply({ content: "❌ You don't have permission to use this command.", ephemeral: true });
        }

        // Permission check
        if (command.permissions && !interaction.member.permissions.has(command.permissions)) {
          return interaction.reply({ content: "❌ You lack the necessary permissions.", ephemeral: true });
        }

        await command.execute(interaction, client);
      }

      // --------- BUTTON HANDLING ---------
      if (interaction.isButton()) {
        const customId = interaction.customId;

        // Ticket creation
        if (customId.startsWith('create_ticket')) {
          const settings = await TicketSettings.findOne({ guildId: interaction.guild.id });
          if (!settings) return interaction.reply({ content: 'Ticket system not configured.', ephemeral: true });

          const category = interaction.guild.channels.cache.get(settings.categoryId);
          const existing = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
          if (existing) return interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });

          const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 0, // Text channel
            parent: category?.id,
            permissionOverwrites: [
              { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
              { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
              { id: settings.supportRoleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]
          });

          interaction.reply({ content: `🎟️ Ticket created: ${ticketChannel}`, ephemeral: true });
        }

        // ModMail creation
        if (customId === 'create_modmail') {
          const settings = await ModMailSettings.findOne({ guildId: interaction.guild.id });
          if (!settings || !settings.channelId) {
            return interaction.reply({ content: 'ModMail is not configured.', ephemeral: true });
          }

          const threadName = `modmail-${interaction.user.username}`;
          const channel = await interaction.guild.channels.fetch(settings.channelId);
          if (!channel) return interaction.reply({ content: 'ModMail channel missing.', ephemeral: true });

          const thread = await channel.threads.create({
            name: threadName,
            reason: `ModMail from ${interaction.user.tag}`,
            type: 11 // Private thread
          });

          thread.send(`📬 New modmail from ${interaction.user} (ID: ${interaction.user.id})`);
          interaction.reply({ content: 'ModMail created. We’ll contact you soon.', ephemeral: true });
        }
      }

      // --------- SELECT MENU HANDLING (GUI Panels) ---------
      if (interaction.isStringSelectMenu()) {
        const [menuType] = interaction.customId.split('_');

        if (menuType === 'automod') {
          const selected = interaction.values[0];
          const settings = await AutoModSettings.findOne({ guildId: interaction.guild.id }) || new AutoModSettings({ guildId: interaction.guild.id });

          if (selected === 'enable_links') settings.linkFiltering = true;
          if (selected === 'disable_links') settings.linkFiltering = false;
          if (selected === 'timeout_action') settings.defaultAction = 'timeout';
          if (selected === 'kick_action') settings.defaultAction = 'kick';
          if (selected === 'ban_action') settings.defaultAction = 'ban';
          if (selected.startsWith('bypassrole_')) settings.bypassRole = selected.split('_')[1];

          await settings.save();
          return interaction.reply({ content: '✅ Automod settings updated.', ephemeral: true });
        }

        if (menuType === 'autorole') {
          const settings = await AutoRoleSettings.findOne({ guildId: interaction.guild.id }) || new AutoRoleSettings({ guildId: interaction.guild.id });

          for (const value of interaction.values) {
            if (value.startsWith('bot_')) settings.botRole = value.split('_')[1];
            else if (value.startsWith('human_')) settings.humanRole = value.split('_')[1];
            else if (value === 'autorole_toggle') settings.enabled = !settings.enabled;
          }

          await settings.save();
          return interaction.reply({ content: '✅ Autorole settings updated.', ephemeral: true });
        }

        if (menuType === 'autoresponder') {
          // Future handling or GUI cleanup
          return interaction.reply({ content: '✅ GUI options updated.', ephemeral: true });
        }
      }

      // --------- MODAL, CONTEXT MENUS, AUTOCOMPLETE (future use) ---------
      // Add any modal or autocomplete logic here if needed.

    } catch (err) {
      console.error(`❌ Interaction Error: ${err.stack}`);
      if (interaction.reply) {
        try {
          await interaction.reply({ content: 'An error occurred while processing this interaction.', ephemeral: true });
        } catch (_) {}
      }
    }
  }
};
