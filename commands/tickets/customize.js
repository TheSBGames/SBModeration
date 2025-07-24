const TicketCategory = require('../../schemas/TicketCategory.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-customize')
    .setDescription('Customize ticket categories')
    .addStringOption(opt => opt.setName('label').setDescription('Button/Menu Label').setRequired(true))
    .addStringOption(opt => opt.setName('description').setDescription('Description').setRequired(true))
    .addChannelOption(opt => opt.setName('category').setDescription('Category Channel').setRequired(true))
    .addRoleOption(opt => opt.setName('role').setDescription('Support Role').setRequired(true)),

  async execute(interaction) {
    const { guildId } = interaction;
    const label = interaction.options.getString('label');
    const description = interaction.options.getString('description');
    const channel = interaction.options.getChannel('category');
    const role = interaction.options.getRole('role');

    let config = await TicketCategory.findOne({ guildId });
    if (!config) config = new TicketCategory({ guildId, categories: [] });

    config.categories.push({
      name: label,
      description,
      channelId: channel.id,
      roleId: role.id,
    });

    await config.save();
    return interaction.reply({ content: '✅ Ticket category added!', ephemeral: true });
  },
};
