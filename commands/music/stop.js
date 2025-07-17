const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Stop the music and clear the queue'),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: '❌ No music is playing.', ephemeral: true });
    }

    queue.delete();
    return interaction.reply('🛑 Music stopped and queue cleared.');
  },
};
