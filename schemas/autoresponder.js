const mongoose = require('mongoose');

const autoresponderSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  trigger: { type: String, required: true }, // lowercase
  response: { type: String, required: true },
});

module.exports = mongoose.model('AutoResponder', autoresponderSchema);
