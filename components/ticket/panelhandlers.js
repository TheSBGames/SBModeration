const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Ticket = require('../../database/ticket/Ticket');

module.exports = {
  customId: 'create_ticket',

  async execute(interaction) {
    const existingTicket = await Ticket.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    if (existingTicket) {
      return interaction.reply({ content: `❌ You already have an open ticket: <#${existingTicket.channelId}>`, ephemeral: true });
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: interaction.channel.parent,
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

    await Ticket.create({
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      channelId: channel.id
    });

    const embed = new EmbedBuilder()
      .setTitle('🎫 Ticket Created')
      .setDescription('A staff member will be with you shortly.')
      .setColor('Green');

    interaction.reply({ content: `✅ Ticket created: <#${channel.id}>`, ephemeral: true });
    channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed] });
  }
};
