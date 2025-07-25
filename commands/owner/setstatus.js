const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setstatus")
    .setDescription("🎛️ Set the bot's status (Owner only)")
    .addStringOption(option =>
      option.setName("type")
        .setDescription("Status type")
        .setRequired(true)
        .addChoices(
          { name: "Playing", value: "Playing" },
          { name: "Watching", value: "Watching" },
          { name: "Listening", value: "Listening" },
          { name: "Competing", value: "Competing" }
        ))
    .addStringOption(option =>
      option.setName("message")
        .setDescription("Status message")
        .setRequired(true)),

  async execute(interaction, client) {
    if (interaction.user.id !== "1186506712040099850") {
      return interaction.reply({ content: "❌ You are not authorized to use this command.", ephemeral: true });
    }

    const type = interaction.options.getString("type");
    const message = interaction.options.getString("message");

    try {
      await client.user.setActivity(message, { type });
      return interaction.reply(`✅ Bot status set to **${type} ${message}**.`);
    } catch (err) {
      console.error(err);
      return interaction.reply("❌ Failed to update status.");
    }
  },
};
