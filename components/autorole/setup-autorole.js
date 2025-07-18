const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const db = require('../../schemas/autorole');

module.exports = {
  async execute(interaction, client) {
    const guildId = interaction.guild.id;

    let settings = await db.findOne({ guildId });
    if (!settings) {
      settings = new db({ guildId });
      await settings.save();
    }

    const embed = new EmbedBuilder()
      .setTitle('👥 Autorole Setup Panel')
      .setDescription('Configure roles to automatically assign to new members or bots.\n\nUse the menu below to choose a setting to update.')
      .setColor('#2B2D31');

    const select = new StringSelectMenuBuilder()
      .setCustomId('autorole-config-menu')
      .setPlaceholder('Choose an autorole setting to update')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Set Human Role')
          .setValue('set-human-role')
          .setDescription('Assign a role to new human users'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Set Bot Role')
          .setValue('set-bot-role')
          .setDescription('Assign a role to new bots'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Toggle Autorole')
          .setValue('toggle-autorole')
          .setDescription('Enable or disable autorole system')
      );

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
