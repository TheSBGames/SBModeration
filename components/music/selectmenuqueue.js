module.exports = {
  customId: "queue-menu",
  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guildId);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: "❌ No music playing.", ephemeral: true });
    }

    const selected = interaction.values[0];
    const track = queue.tracks.at(Number(selected));
    if (!track) return interaction.reply({ content: "Track not found.", ephemeral: true });

    queue.node.skipTo(Number(selected));
    return interaction.reply({ content: `⏭️ Skipped to: **${track.title}**` });
  },
};
