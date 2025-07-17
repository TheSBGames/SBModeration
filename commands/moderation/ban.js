const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server.')
    .addUserOption(option => option.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for ban').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });

    if (!member.bannable) {
      return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });
    }

    await member.ban({ reason });
    await interaction.reply({ content: `🔨 Banned **${user.tag}** | Reason: ${reason}` });
  }
};
