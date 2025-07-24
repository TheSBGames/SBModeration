const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('ticket-menu')
      .setPlaceholder('Choose a ticket category')
      .addOptions([
        {
          label: 'Support',
          description: 'Open a support ticket',
          value: 'ticket_support',
        },
        {
          label: 'Bug Report',
          description: 'Report a bug',
          value: 'ticket_bug',
        },
        {
          label: 'Appeal',
          description: 'Appeal a punishment',
          value: 'ticket_appeal',
        },
        {
          label: 'Partnership',
          description: 'Request a partnership',
          value: 'ticket_partner',
        },
        {
          label: 'Other',
          description: 'Open a general inquiry ticket',
          value: 'ticket_other',
        },
      ])
  ),
};
