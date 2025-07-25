const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-close')
    .setDescription('Close the current ticket'),

  name: 'ticket-close',
  description: 'Close the current ticket',
  usage: '&ticket-close',
  async execute(messageOrInteraction, args, isSlash) {
    const channel = messageOrInteraction.channel;
    const user = isSlash ? messageOrInteraction.user : messageOrInteraction.author;

    if (!channel.name.startsWith('ticket-')) {
      return messageOrInteraction.reply({
        content: 'This command can only be used in a ticket channel.',
        ephemeral: isSlash,
      });
    }

    await messageOrInteraction.reply({
      content: 'Closing ticket...',
      ephemeral: isSlash,
    });

    setTimeout(() => {
      channel.delete().catch(() => {});
    }, 5000);
  },
};
