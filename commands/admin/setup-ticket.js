const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-ticket')
    .setDescription('Configure the ticket panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const categories = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory);
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select_ticket_category')
      .setPlaceholder('Select a category for tickets')
      .setOptions(categories.map(cat => ({
        label: cat.name,
        value: cat.id
      })).slice(0, 25));

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const embed = new EmbedBuilder()
      .setTitle('🎟️ Ticket Setup')
      .setDescription('Choose the category where ticket channels will be created.')
      .setColor('Blue');

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
