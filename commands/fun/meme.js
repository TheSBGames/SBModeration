const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme from Reddit.'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const response = await axios.get('https://meme-api.com/gimme');
      const meme = response.data;

      await interaction.editReply({
        embeds: [
          {
            title: meme.title,
            image: { url: meme.url },
            footer: { text: `👍 ${meme.ups} | r/${meme.subreddit}` },
            color: 0x00AE86
          }
        ]
      });
    } catch (err) {
      console.error('Error fetching meme:', err);
      await interaction.editReply('❌ Could not fetch meme. Try again later.');
    }
  }
};
