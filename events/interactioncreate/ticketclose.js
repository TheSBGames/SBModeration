module.exports = async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== 'close_ticket') return;

  const channel = interaction.channel;

  try {
    await interaction.reply({ content: '🔒 Closing ticket in 5 seconds...' });
    setTimeout(async () => {
      await channel.delete().catch(() => null);
    }, 5000);
  } catch (err) {
    console.error(err);
  }
};
