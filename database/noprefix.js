const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: String,
  expiresAt: Date // null means permanent
});

module.exports = mongoose.model('NoPrefixUser', schema);
