const { EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');
const db = require('../../schemas/autorole');

module.exports = async (interaction) => {
  const guildId = interaction.guild.id;
  const settings = await db.findOne({ guildId });

  const selected = interaction.values[0];

  if (selected === 'set-human-role') {
    const roleSelect = new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId('select-human-role')
        .setPlaceholder('Select a role for human members')
        .setMinValues(1)
        .setMaxValues(1)
    );

    await interaction.update({
      content: 'Select a role to assign to new **human** members:',
      components: [roleSelect],
      embeds: []
    });
  }

  else if (selected === 'set-bot-role') {
    const roleSelect = new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId('select-bot-role')
        .setPlaceholder('Select a role for bots')
        .setMinValues(1)
        .setMaxValues(1)
    );

    await interaction.update({
      content: 'Select a role to assign to **bots**:',
      components: [roleSelect],
      embeds: []
    });
  }

  else if (selected === 'toggle-autorole') {
    settings.enabled = !settings.enabled;
    await settings.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ Autorole Toggled')
      .setDescription(`Autorole has been **${settings.enabled ? 'enabled' : 'disabled'}**.`)
      .setColor('#2B2D31');

    await interaction.update({ embeds: [embed], components: [] });
  }
};
                                             
