const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Tells you a random joke!'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res = await axios.get('https://v2.jokeapi.dev/joke/Any?format=txt');
      await interaction.editReply(res.data);
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Failed to fetch a joke.');
    }
  }
};
