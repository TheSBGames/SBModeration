const playerButtons = require("../../components/music/playerButtons");
const loopButtonRow = require("../../components/music/loopButtonRow");
const generateQueueSelect = require("../../components/music/generateQueueSelect");

await interaction.reply({
  content: `🎵 Now playing: **${track.title}**`,
  components: [
    playerButtons(),
    loopButtonRow(),
    generateQueueSelect(queue)
  ]
});
