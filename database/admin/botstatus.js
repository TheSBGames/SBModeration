const mongoose = require('mongoose');

const botStatusSchema = new mongoose.Schema({
  type: { type: String, default: 'LISTENING' }, // LISTENING, WATCHING, PLAYING, etc.
  name: { type: String, default: 'SB' },
  status: { type: String, default: 'online' }, // online, idle, dnd, invisible
  updatedBy: { type: String }, // userId of the owner who updated it
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BotStatus', botStatusSchema);
