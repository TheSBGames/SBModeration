const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const autoroleSchema = require('../../models/autorole');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('view-autorole')
    .setDescription('View current autorole configuration')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute(interaction) {
    const config = await autoroleSchema.findOne({ guildId: interaction.guild.id });

    if (!config || (!config.userRoleId && !config.botRoleId)) {
      return interaction.reply({ content: '⚠️ No autoroles configured.', ephemeral: true });
    }

    const userRole = config.userRoleId ? `<@&${config.userRoleId}>` : 'Not Set';
    const botRole = config.botRoleId ? `<@&${config.botRoleId}>` : 'Not Set';

    await interaction.reply({
      content: `📋 **Autorole Settings**\nStatus: \`${config.enabled ? 'Enabled' : 'Disabled'}\`\nUser Role: ${userRole}\nBot Role: ${botRole}`,
      ephemeral: true
    });
  }
};
