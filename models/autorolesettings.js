const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: true },
  humanRoleId: { type: String, default: null },
  botRoleId: { type: String, default: null },
});

module.exports = mongoose.model('AutoRoleSettings', schema);
