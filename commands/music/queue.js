const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Show the current music queue'),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);
    if (!queue || !queue.isPlaying()) return interaction.reply({ content: '❌ Nothing is playing right now!', ephemeral: true });

    const current = queue.currentTrack;
    const tracks = queue.tracks.toArray().slice(0, 10);
    const trackList = tracks.map((t, i) => `${i + 1}. ${t.title} [${t.duration}]`).join('\n');

    return interaction.reply({
      embeds: [{
        title: '🎶 Queue',
        description: `**Now Playing:** ${current.title}\n\n${trackList || 'No upcoming tracks.'}`,
        color: 0x00AE86,
      }]
    });
  },
};
