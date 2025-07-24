const mongoose = require('mongoose');

const youtubeSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true }, // Discord channel to send notifications
  youtubeChannelId: { type: String, required: true }, // YouTube channel ID
  lastVideoId: { type: String, default: null },
});

module.exports = mongoose.model('YoutubeSettings', youtubeSettingsSchema);
