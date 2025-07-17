const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('nowplaying').setDescription('Show the currently playing track'),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);

    if (!queue || !queue.currentTrack) {
      return interaction.reply({ content: '❌ Nothing is playing currently!', ephemeral: true });
    }

    const track = queue.currentTrack;

    return interaction.reply({
      embeds: [{
        title: '🎵 Now Playing',
        description: `[${track.title}](${track.url})\nRequested by: ${track.requestedBy}`,
        thumbnail: { url: track.thumbnail },
        fields: [
          { name: 'Duration', value: track.duration, inline: true },
          { name: 'Author', value: track.author, inline: true },
        ],
        color: 0x1DB954,
      }]
    });
  },
};
