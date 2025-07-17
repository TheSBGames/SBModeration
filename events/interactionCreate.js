const {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const db = require('../../utils/database');

module.exports = async (interaction, client) => {
  // === Slash Command Execution ===
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ An error occurred while executing the command.',
        ephemeral: true
      });
    }
  }

  // === Ticket Category Selection ===
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'ticket_category_select') {
      const category = interaction.values[0];
      const ticketData = db.get(`ticket_category_${interaction.guild.id}_${category}`);
      if (!ticketData) {
        return interaction.reply({ content: '❌ Ticket category not found.', ephemeral: true });
      }

      const existing = interaction.guild.channels.cache.find(
        c => c.topic === `TicketUser:${interaction.user.id}`
      );
      if (existing) {
        return interaction.reply({
          content: '❌ You already have an open ticket.',
          ephemeral: true
        });
      }

      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: ticketData.categoryId,
        topic: `TicketUser:${interaction.user.id}`,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
          },
          {
            id: client.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setTitle('🎫 New Ticket')
        .setDescription(`Category: **${category}**\nUser: <@${interaction.user.id}>`)
        .setColor('Green')
        .setTimestamp();

      const closeButton = new ButtonBuilder()
        .setCustomId('ticket-close')
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(closeButton);

      await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });

      await interaction.reply({
        content: `✅ Your ticket has been created: ${channel}`,
        ephemeral: true
      });
    }

    // === Automod GUI Select Menu ===
    if (interaction.customId === 'automod_config_select') {
      const selected = interaction.values[0];

      if (selected === 'toggle_links') {
        let current = db.get(`automod_links_${interaction.guild.id}`) || false;
        db.set(`automod_links_${interaction.guild.id}`, !current);
        return interaction.reply({
          content: `🔗 Link filter is now **${!current ? 'enabled' : 'disabled'}**.`,
          ephemeral: true
        });
      }

      if (selected === 'toggle_badwords') {
        let current = db.get(`automod_badwords_${interaction.guild.id}`) || false;
        db.set(`automod_badwords_${interaction.guild.id}`, !current);
        return interaction.reply({
          content: `🚫 Bad word filter is now **${!current ? 'enabled' : 'disabled'}**.`,
          ephemeral: true
        });
      }

      if (selected === 'set_bypass_role') {
        // handled via modal elsewhere
        return interaction.reply({
          content: 'Use `/automod set-bypass-role` to define the bypass role.',
          ephemeral: true
        });
      }

      if (selected === 'toggle_external_apps') {
        let current = db.get(`automod_externalapps_${interaction.guild.id}`) || false;
        db.set(`automod_externalapps_${interaction.guild.id}`, !current);
        return interaction.reply({
          content: `🧩 External App filter is now **${!current ? 'enabled' : 'disabled'}**.`,
          ephemeral: true
        });
      }
    }

    // === Autorole / Autoresponder GUI Select Menu ===
    if (interaction.customId === 'autorole_config_select') {
      const selected = interaction.values[0];
      if (selected === 'toggle_autorole') {
        const current = db.get(`autorole_enabled_${interaction.guild.id}`) || false;
        db.set(`autorole_enabled_${interaction.guild.id}`, !current);
        return interaction.reply({
          content: `🔄 Autorole is now **${!current ? 'enabled' : 'disabled'}**.`,
          ephemeral: true
        });
      }
      if (selected === 'toggle_autoresponder') {
        const current = db.get(`autoresponder_enabled_${interaction.guild.id}`) || false;
        db.set(`autoresponder_enabled_${interaction.guild.id}`, !current);
        return interaction.reply({
          content: `💬 Autoresponder is now **${!current ? 'enabled' : 'disabled'}**.`,
          ephemeral: true
        });
      }
    }
  }

  // === Ticket Close Button ===
  if (interaction.isButton()) {
    if (interaction.customId === 'ticket-close') {
      if (!interaction.channel.topic?.startsWith('TicketUser:')) {
        return interaction.reply({
          content: '❌ This is not a ticket channel.',
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('📪 Ticket Closed')
        .setDescription(`Closed by: <@${interaction.user.id}>`)
        .setColor('Red')
        .setTimestamp();

      await interaction.channel.send({ embeds: [embed] });
      setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    }
  }
};
