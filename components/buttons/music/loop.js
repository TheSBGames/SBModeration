module.exports = {
  data: {
    name: "music-loop"
  },
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild.id);
    if (!queue) return interaction.reply({ content: "❌ No music is playing.", ephemeral: true });

    let mode = queue.setRepeatMode((queue.repeatMode + 1) % 3);
    const modes = ["Off", "Repeat Song", "Repeat Queue"];
    return interaction.update({ content: `🔁 Loop mode set to: **${modes[mode]}**`, components: [] });
  }
};
