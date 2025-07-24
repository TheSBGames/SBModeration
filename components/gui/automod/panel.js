const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = async (interaction) => {
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return interaction.reply({ content: "You need Administrator permission to use this panel.", ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setTitle("🛡️ AutoMod Setup Panel")
    .setDescription("Configure your automod filters and settings using the buttons below.\n\nChoose what to enable, how to punish violations, and assign a bypass role.")
    .setColor("Blurple");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('automod_filters')
      .setLabel('⚙️ Configure Filters')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('automod_punishments')
      .setLabel('🔨 Set Punishments')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('automod_bypass')
      .setLabel('🚫 Set Bypass Role')
      .setStyle(ButtonStyle.Secondary)
  );

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
};
