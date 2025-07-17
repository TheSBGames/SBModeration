const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or playlist')
    .addStringOption(option =>
      option.setName('query').setDescription('The name or URL of the song').setRequired(true)
    ),

  async execute(interaction, client) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: '❌ You must be in a voice channel to use this command.', ephemeral: true });
    }

    const queue = await client.player.nodes.create(interaction.guild, {
      metadata: interaction.channel,
      leaveOnEnd: true,
      leaveOnEmptyCooldown: 300000,
      leaveOnStop: true,
    });

    try {
      await queue.connect(voiceChannel);
    } catch {
      client.player.nodes.delete(interaction.guildId);
      return interaction.reply({ content: '❌ Failed to join your voice channel!', ephemeral: true });
    }

    const result = await client.player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!result.tracks.length) return interaction.reply({ content: '❌ No results found!', ephemeral: true });

    const track = result.playlist ? result.tracks : result.tracks[0];

    if (result.playlist) queue.addTrack(result.tracks);
    else queue.addTrack(track);

    if (!queue.isPlaying()) await queue.node.play();

    return interaction.reply(`🎶 Added **${result.playlist ? result.playlist.title : track.title}** to the queue!`);
  },
};
