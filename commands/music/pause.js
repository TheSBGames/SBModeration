const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('pause').setDescription('Pause the current song'),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);
    if (!queue || !queue.isPlaying()) return interaction.reply({ content: '❌ No music is playing!', ephemeral: true });

    queue.node.pause();
    return interaction.reply('⏸️ Music paused.');
  },
};
