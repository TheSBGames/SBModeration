const mongoose = require('mongoose');

const TicketCategorySchema = new mongoose.Schema({
  guildId: String,
  categories: [
    {
      name: String,
      description: String,
      channelId: String, // category channel to place tickets under
      roleId: String,     // role that sees this category’s tickets
    },
  ],
});

module.exports = mongoose.model('TicketCategory', TicketCategorySchema);
