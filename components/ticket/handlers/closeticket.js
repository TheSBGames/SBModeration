const TicketTranscript = require('../../../database/ticket/TicketTranscript');
const GuildSettings = require('../../../database/guild-settings');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function closeTicket(interaction) {
  const { guild, channel, user } = interaction;

  // Step 1: Fetch transcript from DB
  const transcript = await TicketTranscript.findOne({ guildId: guild.id, channelId: channel.id });
  if (!transcript || transcript.messages.length === 0) {
    return interaction.reply({ content: 'No transcript found.', ephemeral: true });
  }

  // Step 2: Format transcript as plain text
  const lines = transcript.messages.map(msg => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.authorTag}: ${msg.content}`);
  const content = lines.join('\n');

  // Step 3: Write to file
  const fileName = `transcript-${channel.name}-${Date.now()}.txt`;
  const filePath = path.join(__dirname, `../../../temp/${fileName}`);
  fs.writeFileSync(filePath, content);

  // Step 4: Fetch transcript log channel
  const settings = await GuildSettings.findOne({ guildId: guild.id });
  const logChannelId = settings?.transcriptChannelId;
  const logChannel = logChannelId ? guild.channels.cache.get(logChannelId) : null;

  // Step 5: Send transcript file to transcript channel
  if (logChannel && logChannel.isTextBased()) {
    const file = new AttachmentBuilder(filePath);
    await logChannel.send({
      content: `📄 Transcript for ${channel.name} (closed by <@${user.id}>)`,
      files: [file]
    });
  }

  // Cleanup file after sending
  fs.unlinkSync(filePath);

  // Proceed with ticket close (delete channel etc.)
  await interaction.reply({ content: 'Ticket closed and transcript saved.', ephemeral: true });
  await channel.delete();
}

module.exports = closeTicket;
