const { ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  customId: "music-controls",
  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guildId);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: "No music is currently playing.", ephemeral: true });
    }

    const btn = interaction.customId;

    switch (btn) {
      case "pause":
        queue.node.pause();
        return interaction.update({ content: "⏸️ Paused the music." });

      case "resume":
        queue.node.resume();
        return interaction.update({ content: "▶️ Resumed the music." });

      case "skip":
        queue.node.skip();
        return interaction.update({ content: "⏭️ Skipped the current track." });

      case "stop":
        queue.node.stop();
        return interaction.update({ content: "⏹️ Stopped playback and cleared the queue." });

      case "shuffle":
        queue.tracks.shuffle();
        return interaction.update({ content: "🔀 Shuffled the queue." });

      case "loop":
        const current = queue.repeatMode;
        const newMode = current === 0 ? 1 : 0;
        queue.setRepeatMode(newMode);
        return interaction.update({ content: `🔁 Loop ${newMode === 1 ? "enabled" : "disabled"}.` });

      default:
        return interaction.reply({ content: "Unknown button interaction.", ephemeral: true });
    }
  },
};
