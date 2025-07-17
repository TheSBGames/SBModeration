const { Events } = require('discord.js');
const db = require('../../utils/database');
const fetch = require('node-fetch');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (
      message.author.bot ||
      !message.guild ||
      message.system ||
      message.webhookId
    ) return;

    const gptChannels = db.get(`gpt_channels_${message.guild.id}`) || [];
    if (!gptChannels.includes(message.channel.id)) return;

    // Optionally: add typing indicator
    await message.channel.sendTyping();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a helpful and friendly AI assistant.' },
            { role: 'user', content: message.content }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });

      const data = await response.json();

      if (!data.choices || !data.choices.length) {
        return message.reply('⚠️ ChatGPT did not return a valid response. Please try again later.');
      }

      const reply = data.choices[0].message.content;

      message.reply({
        content: reply.substring(0, 2000)
      });

    } catch (err) {
      console.error('[ChatGPT Handler Error]', err);
      message.reply('❌ Failed to get a response from ChatGPT.');
    }
  }
};
