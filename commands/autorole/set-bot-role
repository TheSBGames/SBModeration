const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const autoroleSchema = require('../../models/autorole');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-bot-role')
    .setDescription('Set the autorole for bots')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to give to bots')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    await autoroleSchema.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { botRoleId: role.id },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `✅ Bot autorole set to: ${role}`, ephemeral: true });
  }
};
