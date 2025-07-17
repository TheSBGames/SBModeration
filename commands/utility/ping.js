const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot's latency."),

  async execute(interaction) {
    const msg = await interaction.reply({ content: "Pinging...", fetchReply: true });
    const latency = msg.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply({
      content: null,
      embeds: [{
        color: 0x2ECC71,
        title: "🏓 Pong!",
        fields: [
          { name: "Bot Latency", value: `${latency}ms`, inline: true },
          { name: "API Latency", value: `${interaction.client.ws.ping}ms`, inline: true }
        ]
      }]
    });
  }
};
