const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const levelSchema = require('../../models/level');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlevel')
    .setDescription('Set the level and XP for a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to set the level for')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('level')
        .setDescription('The level to set')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('xp')
        .setDescription('The XP to set')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const level = interaction.options.getInteger('level');
    const xp = interaction.options.getInteger('xp');

    if (level < 1 || xp < 0) {
      return interaction.reply({ content: 'Level must be at least 1 and XP must be 0 or higher.', ephemeral: true });
    }

    await levelSchema.findOneAndUpdate(
      { guildId: interaction.guild.id, userId: user.id },
      { level, xp },
      { upsert: true }
    );

    interaction.reply({
      content: `✅ Successfully set **${user.username}** to level **${level}** with **${xp} XP**.`,
      ephemeral: true
    });
  }
};
