const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warn = require('../../models/warnSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member.')
    .addUserOption(option => option.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    await Warn.create({
      userId: user.id,
      guildId: interaction.guild.id,
      moderatorId: interaction.user.id,
      reason
    });

    await interaction.reply(`⚠️ Warned **${user.tag}** | Reason: ${reason}`);
  }
};
