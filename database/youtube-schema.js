const mongoose = require('mongoose');

const youtubeSchema = new mongoose.Schema({
  guildId: String,
  channelId: String, // YouTube Channel ID
  notifyChannelId: String, // Discord channel to notify
  latestVideoId: String
});

module.exports = mongoose.model('youtube_subscriptions', youtubeSchema);
