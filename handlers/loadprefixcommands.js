const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  client.prefixCommands = new Map();

  const commandsPath = path.join(__dirname, '../commands');
  const folders = fs.readdirSync(commandsPath);

  for (const folder of folders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);

      if (command.name && typeof command.run === 'function') {
        client.prefixCommands.set(command.name, command);
        console.log(`[📘] Loaded prefix command: ${command.name}`);
      }
    }
  }
};
