const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all commands or info about a specific command."),

  async execute(interaction) {
    await interaction.reply({
      embeds: [{
        title: "📖 Help Menu",
        color: 0x3498DB,
        description: "Here's a list of available commands:",
        fields: [
          { name: "🛠 Moderation", value: "`ban`, `kick`, `warn`, `timeout`, etc." },
          { name: "🎵 Music", value: "`play`, `skip`, `stop`, `queue`, `volume`, etc." },
          { name: "⚙️ Utility", value: "`help`, `avatar`, `ping`, `userinfo`, etc." },
          { name: "💬 ChatGPT", value: "`/ask`, or use in GPT channels" },
          { name: "🛡 AutoMod", value: "`automod panel`, `bypass`, etc." },
          { name: "🎟 Tickets", value: "`ticket`, `closeticket`, etc." },
          { name: "📈 Leveling", value: "`rank`, `levels`, etc." },
        ],
        footer: { text: "Use slash commands ( / ) to interact with the bot." }
      }]
    });
  }
};
