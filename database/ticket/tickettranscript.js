const mongoose = require('mongoose');

const TicketTranscriptSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  messages: [
    {
      authorTag: String,
      authorId: String,
      content: String,
      timestamp: Date
    }
  ],
  closedAt: { type: Date },
  closedBy: { type: String }
});

module.exports = mongoose.model('TicketTranscript', TicketTranscriptSchema);
