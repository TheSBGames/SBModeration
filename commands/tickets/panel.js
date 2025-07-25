const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const TicketPanel = require('../../database/ticket/TicketPanel');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Create a fully customizable ticket panel')
    .addStringOption(option =>
      option.setName('title').setDescription('Embed title').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description').setDescription('Embed description').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('button_label').setDescription('Button label text').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('button_emoji').setDescription('Optional emoji for the button')
    )
    .addChannelOption(option =>
      option.setName('category').setDescription('Channel category to create tickets under')
    ),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const buttonLabel = interaction.options.getString('button_label');
    const buttonEmoji = interaction.options.getString('button_emoji') || '🎫';
    const category = interaction.options.getChannel('category');

    const panelId = uuidv4();

    await TicketPanel.create({
      guildId: interaction.guild.id,
      panelId,
      title,
      description,
      categoryId: category?.id || null,
      customButtonLabel: buttonLabel,
      customButtonEmoji: buttonEmoji
    });

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor('Blue');

    const button = new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel(buttonLabel)
      .setEmoji(buttonEmoji)
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.channel.send({ embeds: [embed], components: [row] });

    return interaction.reply({ content: `✅ Panel created with ID \`${panelId}\``, ephemeral: true });
  }
};
