const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const levelSchema = require('../../models/level');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your or someone else\'s rank.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check')
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const data = await levelSchema.findOne({
      guildId: interaction.guild.id,
      userId: user.id
    });

    if (!data) {
      return interaction.reply({ content: `${user.username} has no XP yet.`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Rank`)
      .setColor('Blurple')
      .addFields(
        { name: 'Level', value: `${data.level}`, inline: true },
        { name: 'XP', value: `${data.xp}`, inline: true }
      )
      .setThumbnail(user.displayAvatarURL());

    interaction.reply({ embeds: [embed] });
  }
};
