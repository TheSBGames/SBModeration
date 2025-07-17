const mongoose = require('mongoose');

const modMailSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  inboxChannelId: { type: String, required: true },
  inboxCategoryId: { type: String },
  logChannelId: { type: String } // Optional logging
});

module.exports = mongoose.model('ModMailConfig', modMailSchema);
