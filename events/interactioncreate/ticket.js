const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const TicketPanel = require('../../models/TicketPanel');

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== 'open_ticket') return;

  const data = await TicketPanel.findOne({ guildId: interaction.guild.id });
  if (!data) return interaction.reply({ content: '❌ Ticket system is not configured properly.', ephemeral: true });

  const ticketName = `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, '');

  const channel = await interaction.guild.channels.create({
    name: ticketName,
    type: ChannelType.GuildText,
    parent: data.categoryId,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
      },
      {
        id: interaction.client.user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels]
      }
    ]
  });

  const embed = new EmbedBuilder()
    .setTitle('🎫 Ticket Created')
    .setDescription(`Hello ${interaction.user}, support will be with you shortly.`)
    .setColor('Green');

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('🔒 Close Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });
  await interaction.reply({ content: `✅ Ticket created: ${channel}`, ephemeral: true });
};
