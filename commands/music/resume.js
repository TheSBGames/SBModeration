const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('resume').setDescription('Resume paused music'),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);
    if (!queue || !queue.node.isPaused()) return interaction.reply({ content: '❌ No paused music to resume.', ephemeral: true });

    queue.node.resume();
    return interaction.reply('▶️ Resumed playback.');
  },
};
