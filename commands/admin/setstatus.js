const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setstatus")
    .setDescription("Set the bot's status (Owner only)")
    .addStringOption(option =>
      option.setName("type")
        .setDescription("Status type")
        .setRequired(true)
        .addChoices(
          { name: "Playing", value: "Playing" },
          { name: "Listening", value: "Listening" },
          { name: "Watching", value: "Watching" },
          { name: "Competing", value: "Competing" }
        )
    )
    .addStringOption(option =>
      option.setName("text")
        .setDescription("Status text")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const ownerId = "1186506712040099850"; // Your Discord ID

    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: "❌ Only the bot owner can use this command.", ephemeral: true });
    }

    const type = interaction.options.getString("type");
    const text = interaction.options.getString("text");

    try {
      await client.user.setActivity(text, { type });
      await interaction.reply({ content: `✅ Status set to **${type} ${text}**`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: "❌ Failed to set status.", ephemeral: true });
    }
  }
};
