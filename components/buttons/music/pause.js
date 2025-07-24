module.exports = {
  data: {
    name: "music-pause"
  },
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild.id);
    if (!queue) return interaction.reply({ content: "❌ No music is currently playing.", ephemeral: true });

    queue.pause();
    return interaction.update({ content: "⏸ Music has been paused.", components: [] });
  }
};
