const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

module.exports = async (client) => {
  const slashCommands = [];
  const commandFolders = fs.readdirSync(path.join(__dirname, "../commands"));

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(path.join(__dirname, `../commands/${folder}`))
      .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`../commands/${folder}/${file}`);

      // Slash commands
      if (command.data) {
        slashCommands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
      }

      // Prefix commands
      if (command.name) {
        client.prefixCommands.set(command.name, command);
      }
    }
  }

  // Register slash commands globally
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: slashCommands }
    );
    console.log("✅ Successfully registered slash commands globally.");
  } catch (error) {
    console.error("❌ Error registering slash commands:", error);
  }
};
