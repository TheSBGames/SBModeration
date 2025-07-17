const mongoose = require('mongoose');

const ticketPanelSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  categoryId: { type: String, required: true }
});

module.exports = mongoose.model('TicketPanel', ticketPanelSchema);
