const { EmbedBuilder } = require('discord.js');

module.exports = {
  async handleAdminButtons(interaction, client) {
    const id = interaction.customId;

    if (id === 'embed-confirm') {
      const embedData = client.tempEmbeds?.[interaction.user.id];
      if (!embedData) {
        return interaction.reply({ content: 'No embed data found.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle(embedData.title || null)
        .setDescription(embedData.description || null)
        .setColor(embedData.color || '#5865F2')
        .setFooter({ text: embedData.footer || null });

      await interaction.channel.send({ embeds: [embed] });
      delete client.tempEmbeds[interaction.user.id];

      return interaction.reply({ content: 'Embed sent successfully.', ephemeral: true });
    }

    if (id === 'embed-cancel') {
      delete client.tempEmbeds[interaction.user.id];
      return interaction.reply({ content: 'Embed creation canceled.', ephemeral: true });
    }
  }
};
