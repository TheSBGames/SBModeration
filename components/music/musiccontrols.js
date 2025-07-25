const { ButtonStyle, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
  customId: [
    "pause",
    "resume",
    "skip",
    "stop",
    "shuffle",
    "loop",
    "nowplaying",
  ],
  
  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guildId);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: "❌ No music is currently playing.", ephemeral: true });
    }

    switch (interaction.customId) {
      case "pause":
        queue.node.pause();
        return interaction.reply({ content: "⏸️ Music paused." });

      case "resume":
        queue.node.resume();
        return interaction.reply({ content: "▶️ Music resumed." });

      case "skip":
        queue.node.skip();
        return interaction.reply({ content: "⏭️ Skipped to the next track." });

      case "stop":
        queue.node.stop();
        return interaction.reply({ content: "⏹️ Stopped music and cleared the queue." });

      case "shuffle":
        queue.tracks.shuffle();
        return interaction.reply({ content: "🔀 Queue shuffled." });

      case "loop":
        const mode = queue.repeatMode;
        const newMode = mode === 0 ? 1 : 0;
        queue.setRepeatMode(newMode);
        return interaction.reply({ content: `🔁 Loop is now **${newMode === 1 ? "enabled" : "disabled"}**.` });

      case "nowplaying":
        const currentTrack = queue.currentTrack;
        return interaction.reply({
          embeds: [
            {
              title: "🎶 Now Playing",
              description: `[${currentTrack.title}](${currentTrack.url})\nDuration: \`${currentTrack.duration}\``,
              thumbnail: { url: currentTrack.thumbnail },
              color: 0x5865f2
            },
          ],
          ephemeral: true,
        });
    }
  },
};
