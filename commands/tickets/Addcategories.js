const { SlashCommandBuilder, ChannelType } = require('discord.js');
const ticketSchema = require('../../models/ticketPanel');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcategory')
    .setDescription('Add a ticket category to the panel.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the category')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Optional description of the category')
        .setRequired(false))
    .addChannelOption(option =>
      option.setName('category_channel')
        .setDescription('The category where tickets will be created')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildCategory)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content: 'You need administrator permission to use this command.', ephemeral: true });

    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description') || null;
    const categoryChannel = interaction.options.getChannel('category_channel');

    await ticketSchema.create({
      guildId: interaction.guild.id,
      name,
      description,
      channelId: categoryChannel.id
    });

    await interaction.reply({ content: `Category \`${name}\` has been added.`, ephemeral: true });
  }
};
