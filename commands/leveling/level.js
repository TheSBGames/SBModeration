const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Levels = require('../../models/levelSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Show your or another user\'s level and XP.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check')
        .setRequired(false)),

  name: 'level',
  description: 'Show your or another user\'s level and XP.',
  aliases: ['rank'],
  async execute(messageOrInteraction, client) {
    const isSlash = !!messageOrInteraction.isChatInputCommand;
    const targetUser = isSlash
      ? messageOrInteraction.options.getUser('user') || messageOrInteraction.user
      : messageOrInteraction.mentions.users.first() || messageOrInteraction.author;

    const guildId = messageOrInteraction.guild.id;

    const levelData = await Levels.findOne({ userId: targetUser.id, guildId });

    if (!levelData) {
      const content = `❌ ${targetUser.username} has no XP or level yet.`;
      return isSlash
        ? messageOrInteraction.reply({ content, ephemeral: true })
        : messageOrInteraction.channel.send(content);
    }

    const embed = {
      color: 0x00bfff,
      title: `📊 ${targetUser.username}'s Level Stats`,
      description: `> **Level**: ${levelData.level}\n> **XP**: ${levelData.xp} / ${levelData.requiredXp}`,
      footer: { text: `User ID: ${targetUser.id}` },
    };

    return isSlash
      ? messageOrInteraction.reply({ embeds: [embed] })
      : messageOrInteraction.channel.send({ embeds: [embed] });
  }
};
