const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = async (interaction) => {
  const embed = new EmbedBuilder()
    .setTitle("🔨 Set Automod Punishment")
    .setDescription("Choose the action that should be taken when a filter is triggered.")
    .setColor("Red");

  const menu = new StringSelectMenuBuilder()
    .setCustomId("automod_punishment_menu")
    .setPlaceholder("Select a punishment")
    .addOptions([
      { label: "Timeout (5m)", value: "timeout" },
      { label: "Mute (Requires mute role)", value: "mute" },
      { label: "Kick", value: "kick" },
      { label: "Ban", value: "ban" },
    ]);

  const row = new ActionRowBuilder().addComponents(menu);

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
};
