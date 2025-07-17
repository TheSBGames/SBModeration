const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout from a user.')
    .addUserOption(option => option.setName('user').setDescription('User to unmute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });

    try {
      await member.timeout(null);
      await interaction.reply(`🔈 Unmuted **${user.tag}**.`);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to unmute user: ${err.message}`, ephemeral: true });
    }
  }
};
