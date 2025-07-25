module.exports = {
  name: "reload",
  description: "🔁 Reloads all slash and prefix commands (Owner only)",
  aliases: [],
  usage: "&reload",
  category: "owner",

  async execute(message, args, client) {
    if (message.author.id !== "1186506712040099850") {
      return message.reply("❌ Only the bot owner can use this command.");
    }

    try {
      // Reload slash commands
      client.commands.clear();
      const { readdirSync } = require("fs");
      const path = require("path");
      const folders = readdirSync(path.join(__dirname, "..", "..", "commands"));

      for (const folder of folders) {
        const files = readdirSync(path.join(__dirname, "..", "..", "commands", folder)).filter(file => file.endsWith(".js"));
        for (const file of files) {
          const command = require(path.join(__dirname, "..", "..", "commands", folder, file));
          if (command.data) {
            client.commands.set(command.data.name, command);
          }
        }
      }

      // Reload prefix commands
      client.prefixCommands.clear();
      const prefixFolders = readdirSync(path.join(__dirname, ".."));
      for (const folder of prefixFolders) {
        const files = readdirSync(path.join(__dirname, "..", folder)).filter(f => f.endsWith(".js"));
        for (const file of files) {
          const cmd = require(path.join(__dirname, "..", folder, file));
          if (cmd.name) client.prefixCommands.set(cmd.name, cmd);
        }
      }

      await client.application.commands.set(client.commands.map(cmd => cmd.data));
      return message.reply("✅ Successfully reloaded all commands.");
    } catch (err) {
      console.error(err);
      return message.reply("❌ Reload failed. Check console for errors.");
    }
  }
};
