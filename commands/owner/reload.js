const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("🔁 Reloads all slash and prefix commands (Owner only)"),

  name: "reload",
  description: "🔁 Reloads all slash and prefix commands (Owner only)",

  async execute(interaction, client) {
    if (interaction.user.id !== "1186506712040099850") {
      return interaction.reply({ content: "❌ Only the bot owner can use this command.", ephemeral: true });
    }

    try {
      // Reload slash commands
      client.commands.clear();
      const commandFolders = fs.readdirSync(path.join(__dirname, ".."));
      for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, "..", folder)).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(path.join(__dirname, "..", folder, file));
          if (command.data) {
            client.commands.set(command.data.name, command);
          }
        }
      }

      // Reload prefix commands
      client.prefixCommands.clear();
      const prefixDir = path.join(__dirname, "..", "..", "prefixCommands");
      if (fs.existsSync(prefixDir)) {
        const prefixFolders = fs.readdirSync(prefixDir);
        for (const folder of prefixFolders) {
          const files = fs.readdirSync(path.join(prefixDir, folder)).filter(f => f.endsWith(".js"));
          for (const file of files) {
            const command = require(path.join(prefixDir, folder, file));
            if (command.name) {
              client.prefixCommands.set(command.name, command);
            }
          }
        }
      }

      await client.application.commands.set(client.commands.map(cmd => cmd.data));
      return interaction.reply("✅ All commands reloaded successfully.");
    } catch (err) {
      console.error(err);
      return interaction.reply("❌ Failed to reload commands. Check console.");
    }
  },
};
