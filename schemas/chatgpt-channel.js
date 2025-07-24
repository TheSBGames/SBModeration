const mongoose = require('mongoose');

const chatgptChannelSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  channels: { type: [String], default: [] },
});

module.exports = mongoose.model('ChatGPTChannel', chatgptChannelSchema);
