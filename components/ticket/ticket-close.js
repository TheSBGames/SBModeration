const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'ticket_close') return;

    const channel = interaction.channel;
    if (!channel.topic || !channel.topic.startsWith('UserID:')) {
      return interaction.reply({ content: '⚠️ This is not a valid ticket channel.', ephemeral: true });
    }

    await interaction.reply({ content: '✅ Closing ticket in 5 seconds...' });

    setTimeout(async () => {
      await channel.delete().catch(() => {});
    }, 5000);
  }
};
