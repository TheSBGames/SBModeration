const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  requiredXp: { type: Number, default: 100 },
});

module.exports = mongoose.model('Levels', levelSchema);
