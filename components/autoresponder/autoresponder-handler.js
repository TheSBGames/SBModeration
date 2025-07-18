const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../schemas/autoresponder');

module.exports = async (interaction) => {
  const guildId = interaction.guild.id;
  const selected = interaction.values[0];

  if (selected === 'add-responder') {
    const modal = new ModalBuilder()
      .setCustomId('add-autoresponder-modal')
      .setTitle('Add Autoresponder');

    const triggerInput = new TextInputBuilder()
      .setCustomId('trigger')
      .setLabel('Trigger (exact word or phrase)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const responseInput = new TextInputBuilder()
      .setCustomId('response')
      .setLabel('Bot Response')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(triggerInput),
      new ActionRowBuilder().addComponents(responseInput)
    );

    await interaction.showModal(modal);
  }

  else if (selected === 'remove-responder') {
    const data = await db.find({ guildId });

    if (!data.length) {
      return await interaction.update({
        content: '❌ No autoresponders found to remove.',
        components: [],
        embeds: []
      });
    }

    const options = data.map(r => ({
      label: r.trigger,
      value: r.trigger,
      description: `Deletes: "${r.response.slice(0, 50)}..."`
    }));

    const select = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('remove-autoresponder')
        .setPlaceholder('Select autoresponder to delete')
        .addOptions(options)
    );

    await interaction.update({
      content: '🗑️ Choose a responder to delete:',
      components: [select],
      embeds: []
    });
  }

  else if (selected === 'list-responders') {
    const responders = await db.find({ guildId });
    const embed = new EmbedBuilder()
      .setTitle('📋 Current Autoresponders')
      .setColor('#2B2D31');

    if (!responders.length) {
      embed.setDescription('No autoresponders found.');
    } else {
      embed.setDescription(
        responders.map(r => `**Trigger:** \`${r.trigger}\`\n**Response:** ${r.response}`).join('\n\n')
      );
    }

    await interaction.update({ embeds: [embed], components: [] });
  }
};
