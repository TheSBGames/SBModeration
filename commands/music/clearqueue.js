const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('clearqueue').setDescription('Clear the entire music queue'),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);

    if (!queue || !queue.tracks || queue.tracks.size === 0) {
      return interaction.reply({ content: '❌ Queue is already empty.', ephemeral: true });
    }

    queue.tracks.clear();
    return interaction.reply('🗑️ Cleared the queue.');
  },
};
