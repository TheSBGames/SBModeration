const getPlayerButtons = require("../../components/music/playerButtons");

await interaction.reply({
  content: `🎶 Now playing: **${track.title}**`,
  components: [getPlayerButtons()],
});
