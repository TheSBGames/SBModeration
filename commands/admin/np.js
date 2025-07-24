const { SlashCommandBuilder } = require('discord.js');
const NoPrefix = require('../../schemas/noPrefix');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('np')
    .setDescription('Manage no-prefix access (bot owner only)')
    .addSubcommand(cmd =>
      cmd.setName('add')
        .setDescription('Grant no-prefix access')
        .addUserOption(opt => opt.setName('user').setDescription('User').setRequired(true))
        .addStringOption(opt => opt.setName('duration').setDescription('10m, 1d, 1w, 1m, 3m, 6m, 1y, permanent').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(false))
    )
    .addSubcommand(cmd =>
      cmd.setName('remove')
        .setDescription('Revoke no-prefix access')
        .addUserOption(opt => opt.setName('user').setDescription('User').setRequired(true))
    ),

  async execute(interaction) {
    const ownerId = '1186506712040099850'; // your ID
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: 'Only the bot owner can use this command.', ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();
    const target = interaction.options.getUser('user');

    if (sub === 'add') {
      const durationStr = interaction.options.getString('duration');
      const reason = interaction.options.getString('reason') || 'No reason';
      const durationMap = {
        '10m': 10 * 60 * 1000,
        '1d': 24 * 60 * 60 * 1000,
        '1w': 7 * 24 * 60 * 60 * 1000,
        '1m': 30 * 24 * 60 * 60 * 1000,
        '3m': 90 * 24 * 60 * 60 * 1000,
        '6m': 180 * 24 * 60 * 60 * 1000,
        '1y': 365 * 24 * 60 * 60 * 1000,
        'permanent': null
      };

      const duration = durationMap[durationStr.toLowerCase()];
      if (durationStr !== 'permanent' && !duration) {
        return interaction.reply({ content: 'Invalid duration. Use: 10m, 1d, 1w, 1m, 3m, 6m, 1y, permanent.', ephemeral: true });
      }

      await NoPrefix.findOneAndUpdate(
        { userId: target.id },
        {
          userId: target.id,
          grantedBy: interaction.user.id,
          reason,
          expiresAt: duration ? Date.now() + duration : null,
        },
        { upsert: true }
      );

      return interaction.reply({
        content: `✅ No-prefix access granted to ${target.tag} ${durationStr !== 'permanent' ? `for ${durationStr}` : 'permanently'}.`,
        ephemeral: false
      });
    }

    if (sub === 'remove') {
      await NoPrefix.findOneAndDelete({ userId: target.id });
      return interaction.reply({ content: `❌ No-prefix access removed from ${target.tag}.`, ephemeral: false });
    }
  }
};
