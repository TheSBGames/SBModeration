module.exports = {
  data: {
    name: "music-resume"
  },
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild.id);
    if (!queue) return interaction.reply({ content: "❌ No music is currently playing.", ephemeral: true });

    queue.resume();
    return interaction.update({ content: "▶️ Music has resumed playing.", components: [] });
  }
};
