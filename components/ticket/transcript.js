const fs = require('fs');
const path = require('path');

async function generateTranscript(channel) {
  const messages = await channel.messages.fetch({ limit: 100 });
  const sorted = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  let content = `📜 Transcript for ${channel.name}\n\n`;
  for (const msg of sorted.values()) {
    content += `[${msg.createdAt.toISOString()}] ${msg.author.tag}: ${msg.cleanContent}\n`;
  }

  const filePath = path.join(__dirname, `../../transcripts/${channel.id}.txt`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);

  return filePath;
}

module.exports = { generateTranscript };
