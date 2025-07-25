const { SlashCommandBuilder } = require('discord.js');
const Levels = require('../../models/levelSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the server\'s XP leaderboard.'),

  name: 'leaderboard',
  description: 'Show the server\'s XP leaderboard.',
  aliases: ['lb', 'top'],
  async execute(messageOrInteraction, client) {
    const isSlash = !!messageOrInteraction.isChatInputCommand;
    const guild = messageOrInteraction.guild;

    const topUsers = await Levels.find({ guildId: guild.id })
      .sort({ level: -1, xp: -1 })
      .limit(10);

    if (!topUsers.length) {
      const content = '❌ No leveling data found for this server.';
      return isSlash
        ? messageOrInteraction.reply({ content, ephemeral: true })
        : messageOrInteraction.channel.send(content);
    }

    const embed = {
      color: 0x00bfff,
      title: '🏆 Server XP Leaderboard',
      description: topUsers
        .map((u, i) => `**${i + 1}.** <@${u.userId}> - Level ${u.level} (${u.xp} XP)`)
        .join('\n'),
      footer: { text: `Requested by ${isSlash ? messageOrInteraction.user.tag : messageOrInteraction.author.tag}` },
    };

    return isSlash
      ? messageOrInteraction.reply({ embeds: [embed] })
      : messageOrInteraction.channel.send({ embeds: [embed] });
  }
};
