const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendembed')
    .setDescription('Send an embedded message to a channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to send the embed in')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Title of the embed')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Main content/description of the embed')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Embed color (hex code like #00ff00)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('button_label')
        .setDescription('Text on the button (optional)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('button_link')
        .setDescription('Link the button should open (optional)')
        .setRequired(false)
    ),

  async slashExecute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
      interaction.guild.ownerId !== interaction.user.id
    ) {
      return interaction.reply({ content: '❌ Only server admins or owners can use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title') || '';
    const description = interaction.options.getString('description');
    const color = interaction.options.getString('color') || '#00AAFF';
    const buttonLabel = interaction.options.getString('button_label');
    const buttonLink = interaction.options.getString('button_link');

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setColor(color);

    if (title) embed.setTitle(title);

    const components = [];

    if (buttonLabel && buttonLink) {
      const button = new ButtonBuilder()
        .setLabel(buttonLabel)
        .setURL(buttonLink)
        .setStyle(ButtonStyle.Link);

      components.push(new ActionRowBuilder().addComponents(button));
    }

    await channel.send({ embeds: [embed], components });

    await interaction.reply({ content: `✅ Embed sent to ${channel}`, ephemeral: true });
  }
};
