const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-create')
    .setDescription('Create a support ticket')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ticket')
        .setRequired(false)
    ),

  name: 'ticket-create',
  description: 'Create a support ticket',
  usage: '&ticket-create [reason]',
  async execute(messageOrInteraction, args, isSlash) {
    const reason = isSlash
      ? messageOrInteraction.options.getString('reason') || 'No reason provided'
      : args.join(' ') || 'No reason provided';

    const guild = messageOrInteraction.guild;
    const user = isSlash ? messageOrInteraction.user : messageOrInteraction.author;
    const existingChannel = guild.channels.cache.find(c => c.name === `ticket-${user.id}`);

    if (existingChannel) {
      return messageOrInteraction.reply({
        content: 'You already have an open ticket!',
        ephemeral: isSlash,
      });
    }

    const channel = await guild.channels.create({
      name: `ticket-${user.id}`,
      type: 0, // 0 = text channel
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: ['ViewChannel'],
        },
        {
          id: user.id,
          allow: ['ViewChannel', 'SendMessages'],
        },
      ],
    });

    await channel.send({
      content: `Ticket created by <@${user.id}>.\n**Reason:** ${reason}`,
    });

    await messageOrInteraction.reply({
      content: `Ticket created: ${channel}`,
      ephemeral: isSlash,
    });
  },
};
