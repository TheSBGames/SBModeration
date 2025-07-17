const { SlashCommandBuilder } = require('discord.js');
const filters = ['bassboost', 'vaporwave', 'nightcore', 'echo', 'karaoke', '8D', 'off'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Apply an audio filter')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Filter type')
        .setRequired(true)
        .addChoices(...filters.map(f => ({ name: f, value: f })))
    ),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: '❌ Nothing is playing right now!', ephemeral: true });
    }

    const filter = interaction.options.getString('type');
    await queue.filters.ffmpeg.setFilterEnabled(filter, filter !== 'off');

    return interaction.reply(`🎚️ Filter **${filter}** has been ${filter === 'off' ? 'disabled' : 'enabled'}.`);
  },
};
