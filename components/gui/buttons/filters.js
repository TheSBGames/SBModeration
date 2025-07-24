const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../../database/guild-settings');

module.exports = async (interaction) => {
  const settings = await db.get(interaction.guild.id);

  const embed = new EmbedBuilder()
    .setTitle("⚙️ AutoMod Filters")
    .setDescription("Enable or disable each automod filter for this server.")
    .setColor("Blue");

  const menu = new StringSelectMenuBuilder()
    .setCustomId("automod_filters_menu")
    .setMinValues(0)
    .setMaxValues(5)
    .setPlaceholder("Select filters to enable")
    .addOptions([
      {
        label: "Anti-Link",
        value: "antiLink",
        default: settings?.automod?.antiLink
      },
      {
        label: "Anti-Invite",
        value: "antiInvite",
        default: settings?.automod?.antiInvite
      },
      {
        label: "Anti-Bad Words",
        value: "antiBadwords",
        default: settings?.automod?.antiBadwords
      },
      {
        label: "Anti-Spam",
        value: "antiSpam",
        default: settings?.automod?.antiSpam
      },
      {
        label: "Anti-External Apps",
        value: "antiExternalApps",
        default: settings?.automod?.antiExternalApps?.enabled
      }
    ]);

  const row = new ActionRowBuilder().addComponents(menu);

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
};
