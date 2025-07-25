// File: commands/ticket/transcript.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-transcript')
    .setDescription('Generate a text transcript of this ticket'),
  async execute(interaction) {
    const channel = interaction.channel;

    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ This command must be used in a ticket channel.', ephemeral: true });
    }

    let messages = await channel.messages.fetch({ limit: 100 });
    messages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

    const transcript = messages.map(msg =>
      `[${new Date(msg.createdAt).toLocaleString()}] ${msg.author.tag}: ${msg.cleanContent}`
    ).join('\n');

    const filePath = path.join(__dirname, `transcript-${channel.id}.txt`);
    fs.writeFileSync(filePath, transcript);

    await interaction.reply({ files: [filePath] });
    fs.unlinkSync(filePath); // Clean up after sending
  }
};
