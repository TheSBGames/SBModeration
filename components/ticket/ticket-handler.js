const { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    
    const customId = interaction.customId;
    if (!customId.startsWith('ticket_')) return;

    const [ , categoryId ] = customId.split('_');
    const config = db.get(`ticket_category_${interaction.guild.id}_${categoryId}`);

    if (!config) return interaction.reply({ content: '⚠️ This ticket category is not configured.', ephemeral: true });

    const existing = interaction.guild.channels.cache.find(c => 
      c.topic === `UserID: ${interaction.user.id}` && c.name.startsWith('ticket-')
    );

    if (existing) {
      return interaction.reply({ content: '📝 You already have an open ticket.', ephemeral: true });
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: config.categoryId,
      topic: `UserID: ${interaction.user.id}`,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.ReadMessageHistory
          ]
        },
        {
          id: client.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle(config.panelTitle || '🎫 New Ticket')
      .setDescription(config.panelDesc || 'Please wait while our team responds.')
      .setColor('Blue');

    const closeButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_close')
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [closeButton] });

    await interaction.reply({ content: `✅ Ticket created: ${channel}`, ephemeral: true });
  }
};
