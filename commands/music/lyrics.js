const { SlashCommandBuilder } = require('discord.js');
const lyricsFinder = require('lyrics-finder');

module.exports = {
  data: new SlashCommandBuilder().setName('lyrics').setDescription('Fetch lyrics for the current song'),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);

    if (!queue || !queue.currentTrack) {
      return interaction.reply({ content: '❌ No song currently playing.', ephemeral: true });
    }

    const song = queue.currentTrack.title;
    const lyrics = await lyricsFinder(song, '') || 'No lyrics found for this track.';

    return interaction.reply({
      embeds: [{
        title: `🎤 Lyrics for: ${song}`,
        description: lyrics.length > 4000 ? lyrics.slice(0, 4000) + '...' : lyrics,
        color: 0xE91E63,
      }]
    });
  },
};
