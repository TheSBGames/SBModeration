const { SlashCommandBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const ticketSchema = require('../../models/ticketPanel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createpanel')
    .setDescription('Create a ticket panel for users to open tickets.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Title of the embed')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Description of the embed')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to send the panel')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content: 'You must be an admin to use this command.', ephemeral: true });

    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const channel = interaction.options.getChannel('channel');

    const categories = await ticketSchema.find({ guildId: interaction.guild.id });
    if (!categories.length) {
      return interaction.reply({ content: 'Please set up at least one ticket category before creating the panel.', ephemeral: true });
    }

    const menu = new StringSelectMenuBuilder()
      .setCustomId('ticket_category_select')
      .setPlaceholder('Select a category for your ticket')
      .addOptions(categories.map(c => ({
        label: c.name,
        description: c.description || 'No description provided.',
        value: c.id
      })));

    const row = new ActionRowBuilder().addComponents(menu);

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor('#2F3136');

    await channel.send({ embeds: [embed], components: [row] });

    await interaction.reply({ content: 'Ticket panel created successfully.', ephemeral: true });
  }
};
