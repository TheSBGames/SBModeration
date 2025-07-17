const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skip the current song'),

  async execute(interaction, client) {
    const queue = client.player.nodes.get(interaction.guild.id);
    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: '❌ Nothing is playing right now!', ephemeral: true });
    }

    await queue.node.skip();
    return interaction.reply('⏭️ Skipped the current track!');
  },
};
