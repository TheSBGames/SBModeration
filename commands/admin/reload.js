const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload bot commands (owner only)"),

  async execute(interaction, client) {
    const ownerId = "1186506712040099850"; // Your Discord ID

    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: "❌ Only the bot owner can use this command.", ephemeral: true });
    }

    try {
      await client.commands.clear();
      await client.prefixCommands.clear();
      client.cooldowns.clear();

      for (const handler of ["commandHandler"]) {
        delete require.cache[require.resolve(`../../handlers/${handler}`)];
        require(`../../handlers/${handler}`)(client);
      }

      await interaction.reply({ content: "✅ Commands reloaded globally.", ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "❌ Failed to reload commands.", ephemeral: true });
    }
  }
};
