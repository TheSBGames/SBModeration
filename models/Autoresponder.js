const mongoose = require('mongoose');

const autoresponderSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  triggers: [
    {
      keyword: { type: String, required: true },
      response: { type: String, required: true },
      isEmbed: { type: Boolean, default: false }
    }
  ],
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Autoresponder', autoresponderSchema);
