module.exports = {
  data: {
    name: "music-volume-up"
  },
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild.id);
    if (!queue) return interaction.reply({ content: "❌ No music is playing.", ephemeral: true });

    let newVolume = queue.volume + 10;
    if (newVolume > 100) newVolume = 100;

    queue.setVolume(newVolume);
    return interaction.update({ content: `🔊 Volume increased to ${newVolume}%`, components: [] });
  }
};
