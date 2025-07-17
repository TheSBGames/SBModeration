const mongoose = require('mongoose');

const autoModSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: true },
  blockedWords: { type: [String], default: [] },
  blockLinks: { type: Boolean, default: false },
  blockExternalApps: { type: Boolean, default: false },
  timeoutAction: { type: String, default: '10m' },
  muteAction: { type: String, default: null },
  kickAction: { type: String, default: null },
  banAction: { type: String, default: null },
  bypassRoleId: { type: String, default: null }
});

module.exports = mongoose.model('AutoModSettings', autoModSchema);
