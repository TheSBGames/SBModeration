const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = () => {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("loop").setLabel("Toggle Loop").setStyle(ButtonStyle.Secondary).setEmoji("🔁"),
    new ButtonBuilder().setCustomId("nowplaying").setLabel("Now Playing").setStyle(ButtonStyle.Primary).setEmoji("🎶")
  );
};
