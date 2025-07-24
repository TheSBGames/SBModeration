module.exports = {
  data: {
    name: "music-volume-down"
  },
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild.id);
    if (!queue) return interaction.reply({ content: "❌ No music is playing.", ephemeral: true });

    let newVolume = queue.volume - 10;
    if (newVolume < 0) newVolume = 0;

    queue.setVolume(newVolume);
    return interaction.update({ content: `🔉 Volume decreased to ${newVolume}%`, components: [] });
  }
};
