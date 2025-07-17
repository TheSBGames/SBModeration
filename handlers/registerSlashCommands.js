const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  const commands = [];
  const commandsPath = path.join(__dirname, '../commands');
  const folders = fs.readdirSync(commandsPath);

  for (const folder of folders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      if (command.data) {
        client.slashCommands.set(command.data.name, command);
        commands.push(command.data.toJSON());
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('[🔁] Refreshing global slash commands...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('[✅] Successfully registered global slash commands.');
  } catch (error) {
    console.error('[❌] Failed to register slash commands:', error);
  }
};
