const mongoose = require('mongoose');

const embedLogsSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  embed: {
    title: String,
    description: String,
    color: String,
    footer: String,
    timestamp: Date
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmbedLogs', embedLogsSchema);
