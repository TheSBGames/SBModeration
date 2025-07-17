const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  welcomeChannelId: String,
  leaveChannelId: String,
  welcomeMessage: String,
  leaveMessage: String
});

module.exports = mongoose.model('WelcomeSettings', welcomeSchema);
