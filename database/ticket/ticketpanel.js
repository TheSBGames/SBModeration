const mongoose = require('mongoose');

const TicketPanelSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  panelId: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  categoryId: { type: String }, // NEW: Category channel ID to create tickets under
  customButtonLabel: { type: String },
  customButtonEmoji: { type: String }
});

module.exports = mongoose.model('TicketPanel', TicketPanelSchema);
