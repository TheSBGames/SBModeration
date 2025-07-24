module.exports = async (interaction, client) => {
  const { customId } = interaction;

  // Automod Menus
  if (customId.startsWith('automod_')) {
    const automod = require('../menus/automod/menu');
    return automod(interaction, client);
  }

  // Ticket Category/Menu Config
  if (customId.startsWith('ticket_')) {
    const ticket = require('../menus/ticket/menu');
    return ticket(interaction, client);
  }

  // Autorole Menu
  if (customId.startsWith('autorole_')) {
    const autorole = require('../menus/autorole/menu');
    return autorole(interaction, client);
  }

  // Autoresponder Menu
  if (customId.startsWith('autoresponder_')) {
    const autoresponder = require('../menus/autoresponder/menu');
    return autoresponder(interaction, client);
  }

  // No Prefix GUI
  if (customId.startsWith('noprefix_')) {
    const noprefix = require('../menus/noprefix/menu');
    return noprefix(interaction, client);
  }

  // ChatGPT Channel Config
  if (customId.startsWith('chatgpt_')) {
    const chatgpt = require('../menus/chatgpt/menu');
    return chatgpt(interaction, client);
  }

  // Embed GUI
  if (customId.startsWith('embed_')) {
    const embed = require('../menus/embed/menu');
    return embed(interaction, client);
  }

  // Unknown menu
  await interaction.reply({ content: '❌ Unknown select menu.', ephemeral: true });
};
