module.exports = {
  data: {
    name: "music-stop"
  },
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild.id);
    if (!queue) return interaction.reply({ content: "❌ Nothing to stop.", ephemeral: true });

    queue.stop();
    return interaction.update({ content: "⏹ Music has been stopped.", components: [] });
  }
};
