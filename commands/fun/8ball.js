const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8ball a question.')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Your question for the 8ball')
        .setRequired(true)),
  async execute(interaction) {
    const responses = [
      "Yes.", "No.", "Maybe.", "Absolutely!", "I don't think so.",
      "Ask again later.", "Definitely not.", "It is certain.", "Cannot predict now.", "Very doubtful."
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply({ content: `🎱 ${reply}`, ephemeral: false });
  }
};
