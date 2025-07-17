const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const autoroleSchema = require('../../models/autorole');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-user-role')
    .setDescription('Set the autorole for human users')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to give to users')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    await autoroleSchema.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { userRoleId: role.id },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `✅ User autorole set to: ${role}`, ephemeral: true });
  }
};
