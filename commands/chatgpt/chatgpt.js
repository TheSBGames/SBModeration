const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../config.json');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chatgpt')
    .setDescription('Talk to ChatGPT!')
    .addStringOption(option =>
      option.setName('prompt').setDescription('What do you want to ask?').setRequired(true)
    ),
  name: 'chatgpt',
  description: 'Talk to ChatGPT!',
  aliases: ['ask', 'gpt'],
  usage: '&chatgpt <your question>',
  cooldown: 5,

  async execute(message, args, client) {
    const prompt = args.join(' ');
    if (!prompt) return message.reply('Please provide a prompt.');

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      });

      const reply = response.data.choices[0].message.content;
      return message.reply({ content: reply.substring(0, 2000) });
    } catch (err) {
      console.error(err);
      return message.reply('❌ Error contacting OpenAI. Please try again later.');
    }
  },

  async slashExecute(interaction, client) {
    const prompt = interaction.options.getString('prompt');

    await interaction.deferReply();

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      });

      const reply = response.data.choices[0].message.content;
      return interaction.editReply({ content: reply.substring(0, 2000) });
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ Error contacting OpenAI.');
    }
  },
};
