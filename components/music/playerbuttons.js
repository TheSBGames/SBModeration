const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = () => {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("pause").setLabel("Pause").setStyle(ButtonStyle.Secondary).setEmoji("⏸️"),
    new ButtonBuilder().setCustomId("resume").setLabel("Resume").setStyle(ButtonStyle.Success).setEmoji("▶️"),
    new ButtonBuilder().setCustomId("skip").setLabel("Skip").setStyle(ButtonStyle.Primary).setEmoji("⏭️"),
    new ButtonBuilder().setCustomId("shuffle").setLabel("Shuffle").setStyle(ButtonStyle.Secondary).setEmoji("🔀"),
    new ButtonBuilder().setCustomId("stop").setLabel("Stop").setStyle(ButtonStyle.Danger).setEmoji("⏹️")
  );
};
