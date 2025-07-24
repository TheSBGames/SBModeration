const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  createNoPrefixMenu(user) {
    const embed = new EmbedBuilder()
      .setTitle('🎛️ No Prefix Configuration')
      .setDescription(`Choose a duration to allow **No Prefix** commands for <@${user.id}>`)
      .setColor('Blue');

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`noprefix_duration_${user.id}`)
      .setPlaceholder('Select duration')
      .addOptions([
        {
          label: '10 Minutes',
          value: '10m',
          description: 'Allow for 10 minutes',
        },
        {
          label: '1 Week',
          value: '1w',
          description: 'Allow for 1 week',
        },
        {
          label: '1 Month',
          value: '1mo',
          description: 'Allow for 1 month',
        },
        {
          label: '3 Months',
          value: '3mo',
          description: 'Allow for 3 months',
        },
        {
          label: '6 Months',
          value: '6mo',
          description: 'Allow for 6 months',
        },
        {
          label: '1 Year',
          value: '1y',
          description: 'Allow for 1 year',
        },
        {
          label: 'Permanent',
          value: 'perm',
          description: 'Allow permanently until revoked',
        },
        {
          label: '❌ Remove Access',
          value: 'remove',
          description: 'Revoke No Prefix access',
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    return { embeds: [embed], components: [row] };
  },
};
