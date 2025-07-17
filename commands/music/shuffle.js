const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffle the current queue'),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: '❌ No queue to shuffle.', ephemeral: true });
    }

    queue.tracks.shuffle();
    return interaction.reply('🔀 Queue shuffled.');
  },
};
