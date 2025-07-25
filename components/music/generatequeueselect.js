const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = (queue) => {
  const options = queue.tracks.slice(0, 25).map((track, index) => 
    new StringSelectMenuOptionBuilder()
      .setLabel(`${index + 1}. ${track.title.slice(0, 50)}`)
      .setValue(index.toString())
  );

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("queue-menu")
      .setPlaceholder("🎵 Choose a track to skip to")
      .addOptions(options)
  );
};
