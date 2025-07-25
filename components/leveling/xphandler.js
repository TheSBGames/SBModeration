const Levels = require('../../models/levelSchema');
const { calculateXp } = require('../../utils/calculateXp');

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) return;

  const userId = message.author.id;
  const guildId = message.guild.id;

  const xpToAdd = Math.floor(Math.random() * 10) + 5;

  let user = await Levels.findOne({ userId, guildId });

  if (!user) {
    user = new Levels({
      userId,
      guildId,
      xp: xpToAdd,
      level: 1,
      requiredXp: calculateXp(1)
    });
  } else {
    user.xp += xpToAdd;

    while (user.xp >= user.requiredXp) {
      user.level += 1;
      user.xp -= user.requiredXp;
      user.requiredXp = calculateXp(user.level);

      const levelUpEmbed = {
        color: 0x00ff00,
        title: '🎉 Level Up!',
        description: `Congratulations <@${userId}>, you reached **Level ${user.level}**!`,
      };
      message.channel.send({ embeds: [levelUpEmbed] }).catch(() => {});
    }
  }

  await user.save();
};
