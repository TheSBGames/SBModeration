const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user using timeout.')
    .addUserOption(option => option.setName('user').setDescription('User to mute').setRequired(true))
    .addIntegerOption(option => option.setName('duration').setDescription('Duration in minutes').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for mute'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });

    try {
      await member.timeout(duration * 60 * 1000, reason);
      await interaction.reply(`🔇 Muted **${user.tag}** for ${duration} minute(s).`);
    } catch (err) {
      await interaction.reply({ content: `❌ Failed to mute user: ${err.message}`, ephemeral: true });
    }
  }
};
