const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');
const TicketPanel = require('../../models/TicketPanel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createpanel')
    .setDescription('Create a ticket panel for support.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Embed title')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Embed description')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to send the ticket panel to')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Category ID where tickets should be created')
        .setRequired(true)
    ),

  async slashExecute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const channel = interaction.options.getChannel('channel');
    const categoryId = interaction.options.getString('category');

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor('Blurple');

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('🎫 Open Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await TicketPanel.findOneAndUpdate(
      { guildId: interaction.guild.id },
      {
        guildId: interaction.guild.id,
        categoryId,
      },
      { upsert: true }
    );

    await channel.send({ embeds: [embed], components: [button] });

    await interaction.reply({ content: '✅ Ticket panel sent!', ephemeral: true });
  }
};
