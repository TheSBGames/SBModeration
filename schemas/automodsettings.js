// File: models/AutoModSettings.js

const mongoose = require("mongoose");

const autoModSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },

  filters: {
    links: { type: Boolean, default: false },
    invites: { type: Boolean, default: false },
    badWords: { type: Boolean, default: false },
    spam: { type: Boolean, default: false },
    externalApps: { type: Boolean, default: false },
  },

  punishments: {
    links: { type: String, enum: ["timeout", "kick", "ban", "mute", "warn", "none"], default: "timeout" },
    invites: { type: String, enum: ["timeout", "kick", "ban", "mute", "warn", "none"], default: "timeout" },
    badWords: { type: String, enum: ["timeout", "kick", "ban", "mute", "warn", "none"], default: "timeout" },
    spam: { type: String, enum: ["timeout", "kick", "ban", "mute", "warn", "none"], default: "timeout" },
    externalApps: { type: String, enum: ["timeout", "kick", "ban", "mute", "warn", "none"], default: "timeout" },
  },

  bypass: {
    adminBypass: { type: Boolean, default: true },
    roleBypass: { type: String, default: null }, // role ID
  },

  logChannelId: { type: String, default: null }, // For logging automod actions

  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AutoModSettings", autoModSettingsSchema);
