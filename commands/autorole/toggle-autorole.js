const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const autoroleSchema = require('../../models/autorole');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('toggle-autorole')
    .setDescription('Enable or disable autorole system')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable or disable')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute(interaction) {
    const enabled = interaction.options.getBoolean('enabled');

    await autoroleSchema.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { enabled },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `🔧 Autorole has been **${enabled ? 'enabled' : 'disabled'}**`, ephemeral: true });
  }
};
