const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('autoplay').setDescription('Toggle autoplay mode'),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: '❌ No active queue!', ephemeral: true });
    }

    const mode = queue.setRepeatMode(queue.repeatMode === 3 ? 0 : 3);
    const status = mode === 3 ? 'enabled' : 'disabled';

    return interaction.reply(`🔁 Autoplay has been **${status}**.`);
  },
};
