const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '&' },
  mediaOnlyChannels: { type: [String], default: [] },
  automod: {
    enabled: { type: Boolean, default: false },
    badWords: { type: [String], default: [] },
    blockedLinks: { type: Boolean, default: false },
    externalApps: { type: Boolean, default: false },
    punishments: {
      badWords: { type: String, default: 'timeout' }, // timeout, mute, kick, ban
      links: { type: String, default: 'timeout' },
      externalApps: { type: String, default: 'timeout' },
    },
    bypassRole: { type: String, default: null }
  }
});

module.exports = mongoose.model('GuildSettings', guildSettingsSchema);
