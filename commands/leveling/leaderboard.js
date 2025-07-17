const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const levelSchema = require('../../models/level');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the top 10 users with the highest XP.'),

  async execute(interaction) {
    const data = await levelSchema.find({ guildId: interaction.guild.id }).sort({ level: -1, xp: -1 }).limit(10);

    if (!data.length) {
      return interaction.reply({ content: 'No users found in leaderboard.', ephemeral: true });
    }

    const leaderboard = data.map((user, index) => {
      const member = interaction.guild.members.cache.get(user.userId);
      return `**${index + 1}.** ${member ? member.user.username : 'Unknown User'} - Level ${user.level} (${user.xp} XP)`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('🏆 Server Leaderboard')
      .setDescription(leaderboard)
      .setColor('Gold');

    interaction.reply({ embeds: [embed] });
  }
};
