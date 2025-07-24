const mongoose = require('mongoose');

const noPrefixSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  grantedBy: { type: String }, // Admin or bot owner
  reason: { type: String },
  expiresAt: { type: Number }, // timestamp in ms; null or undefined for permanent
});

module.exports = mongoose.model('NoPrefix', noPrefixSchema);
