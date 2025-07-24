module.exports = {
  data: {
    name: "music-autoplay"
  },
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild.id);
    if (!queue) return interaction.reply({ content: "❌ No music is playing.", ephemeral: true });

    const mode = queue.toggleAutoplay();
    return interaction.update({ content: `🎶 Autoplay is now **${mode ? "Enabled" : "Disabled"}**.`, components: [] });
  }
};
