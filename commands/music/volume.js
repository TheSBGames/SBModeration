const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the playback volume')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Volume level (1-100)')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const volume = interaction.options.getInteger('amount');
    const queue = client.player.nodes.get(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: '❌ Nothing is playing right now!', ephemeral: true });
    }

    if (volume < 1 || volume > 100) {
      return interaction.reply({ content: '⚠️ Please provide a volume between 1 and 100.', ephemeral: true });
    }

    queue.node.setVolume(volume);
    return interaction.reply(`🔊 Volume set to **${volume}%**.`);
  },
};
