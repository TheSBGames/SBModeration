module.exports = {
  data: {
    name: "music-skip"
  },
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild.id);
    if (!queue) return interaction.reply({ content: "❌ No song to skip.", ephemeral: true });

    queue.skip();
    return interaction.update({ content: "⏭ Skipped to the next song.", components: [] });
  }
};
